﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bislerium.Data;
using Bislerium.Models;
using Microsoft.AspNetCore.Authorization;
using NuGet.Protocol.Core.Types;
using AutoMapper;
using Bislerium.Interfaces;
using Bislerium.Services;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Microsoft.AspNetCore.Identity;
using Bislerium.Migrations;
using Microsoft.Extensions.Hosting;
using System.IO;

namespace Bislerium.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly AppDbContext _context;

		private readonly IHostEnvironment _hostEnvironment;
		protected readonly IRepositoryManager _repository;
        public BlogsController(AppDbContext context, IRepositoryManager repositoryManager,IHostEnvironment hostEnvironment)
        {
            _context = context;
            _repository = repositoryManager;
            _hostEnvironment = hostEnvironment;
        }

        // GET: api/Blogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlog()
        {
			return await _context.Blog
				.Select(x => new Blog()
				{
					Title = x.Title,
					Body = x.Body,
					ImageName = x.ImageName,
					ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageName)
				})
				.ToListAsync();
			//return await _context.Blog.ToListAsync();
        }

		// GET: api/Blogs
		[HttpGet("/currentUserBlogs")]
        
		public async Task<ActionResult<IEnumerable<Blog>>> GetCurrentUsersBlog()
		{
			string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();
			//var blogs = await _context.Blog
			   //.Where(c => c.BloggerId == getCurrentUserId)
			  // .ToListAsync();
			var blogs =  await _context.Blog
				.Where(c => c.BloggerId == getCurrentUserId)
				.Select(x => new Blog()
				{
					Title = x.Title,
					Body = x.Body,
					ImageName = x.ImageName,
					ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageName)
				})
				.ToListAsync();
			if (blogs == null || blogs.Count == 0)
			{
				return NotFound();
			}

			return blogs;
			
		}

		// GET: api/Blogs/5
		[HttpGet("{id}")]
        public async Task<ActionResult<Blog>> GetBlog(int id)
        {
			var blog = await _context.Blog
				.Where(x => x.BlogId == id)
				.Select(x => new Blog
				{
					BlogId = x.BlogId,
					Title = x.Title,
					Body = x.Body,
					ImageName = x.ImageName,
					ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageName)
				})
				.FirstOrDefaultAsync();

			if (blog == null)
            {
                return NotFound();
            }

            return blog;
        }

        // PUT: api/Blogs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBlog(int id, Blog blog)
        {
            if (id != blog.BlogId)
            {
                return BadRequest();
            }
			var existingblog = await _context.Blog.FindAsync(id);
			// Update the properties of the existing user with the values from the updatedUser
			existingblog.Title = blog.Title ?? existingblog.Title;
            existingblog.Body = blog.Body ?? existingblog.Body;
            _context.Entry(existingblog).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Blogs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        //[Authorize(Roles = "Admins,Blogger")]
        public async Task<ActionResult<Blog>> PostBlog(Blog blog)
        {
            string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();
            blog.BloggerId= getCurrentUserId;
			blog.ImageName = await SaveImage(blog.ImageFile);
			_context.Blog.Add(blog);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBlog", new { id = blog.BlogId }, blog);
        }

		[NonAction]
		public async Task<string> SaveImage(IFormFile imageFile)
		{
			if (imageFile == null || imageFile.Length == 0)
			{
				throw new ArgumentNullException("imageFile", "Image file is required and cannot be empty.");
			}

			// Generate unique image name
			string imageName = Path.GetFileNameWithoutExtension(imageFile.FileName);
			imageName = imageName.Substring(0, Math.Min(imageName.Length, 10)); // Limit to first 10 characters
			imageName = imageName.Replace(' ', '-') + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);

			// Construct full file path
			var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);

			// Save file to disk
			using (var fileStream = new FileStream(imagePath, FileMode.Create))
			{
				await imageFile.CopyToAsync(fileStream);
			}

			return imageName;
		}

		// DELETE: api/Blogs/5
		[HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Blogger")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blog.FindAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            _context.Blog.Remove(blog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{blogId}/comments")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetAllComments(int blogId)
        {

            var comments = await _context.Comments
                .Where(c => c.BlogId == blogId)
                .ToListAsync();

            if (comments == null || comments.Count == 0)
            {
                return NotFound();
            }

            return comments;
        }

        [HttpPost("{blogId}/comments")]
        public async Task<ActionResult> AddComment(int blogId, Comment comment)
        {
            // Call the method to add the comment to the blog
            // Retrieve the blog from the database
            var blog = await _context.Blog.FindAsync(blogId);
            string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();
            var newComment = new Comment
            {
                Content = comment.Content,
                UserId = getCurrentUserId, // Assuming the ID of the user who posted the comment
                BlogId = blogId // Assuming the ID of the blog post to which the comment belongs
            };

            if (blog == null)
            {
                return NotFound(); // Return 404 Not Found if blog with the specified ID is not found
            }
            
            // Associate the comment with the blog
           _context.Comments.Add(newComment);
			
			// Save changes to persist the new comment in the database
			await _context.SaveChangesAsync();
			int updatedBlogPopularity = BlogPopularityCalculator.CalculateBlogPopularity(blogId, _context.Reactions, _context.Comments);

			// Update the BlogPopularity property of the blog post
			blog.BlogPopularity = updatedBlogPopularity;
			await _context.SaveChangesAsync();

			return Ok(); // Return 200 OK if the comment was added successfully
        }

        [HttpPost("{blogId}/upvote")]
        public async Task<ActionResult> Upvote(int blogId)
        {
            // Call the method to add the comment to the blog
            // Retrieve the blog from the database
            var blog = await _context.Blog.FindAsync(blogId);
            string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();
            var existingReaction = _context.Reactions.FirstOrDefault(r => r.UserId == getCurrentUserId && r.BlogId == blogId);
            // Create a new Reaction
            var newReaction = new Reaction
            {
                UserId = getCurrentUserId,
                BlogId = blogId
            };
            if (existingReaction == null)
            {
               

                // Upvote the blog
                newReaction.Upvote=true;
                newReaction.CreatedAt= DateTime.Now;
                // Add the new Reaction to DbContext and save changes
                _context.Reactions.Add(newReaction);
            }
            else
            {
                if (existingReaction.Upvote)
                {
                    // If user previously upvoted, toggle off the upvote
                    existingReaction.Upvote = false;
                }
                else
                {
                    // If user previously downvoted or had no reaction, toggle on the upvote
                    existingReaction.Upvote = true;
					existingReaction.CreatedAt = DateTime.Now;
					existingReaction.Downvote = false; // Reset downvote if applicable
                }
            }
			await _context.SaveChangesAsync();

			int updatedBlogPopularity = BlogPopularityCalculator.CalculateBlogPopularity(blogId, _context.Reactions, _context.Comments);

            // Update the BlogPopularity property of the blog post
            blog.BlogPopularity = updatedBlogPopularity;

            // Save changes to persist the new comment in the database
            await _context.SaveChangesAsync();

            return Ok(); // Return 200 OK if the comment was added successfully
        }

		[HttpGet("upvoteCount/{blogId}")]
		public async Task<ActionResult> GetUpvoteCount(int blogId)
		{

			int upvotes = _context.Reactions.Count(r => r.BlogId == blogId && r.Upvote);

			

			return Ok(upvotes);
		}

		[HttpPost("{blogId}/downvote")]
        public async Task<ActionResult> Downvote(int blogId)
        {
            // Call the method to add the comment to the blog
            // Retrieve the blog from the database
            var blog = await _context.Blog.FindAsync(blogId);
            string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();
            var existingReaction = _context.Reactions.FirstOrDefault(r => r.UserId == getCurrentUserId && r.BlogId == blogId);
            // Create a new Reaction
            var newReaction = new Reaction
            {
                UserId = getCurrentUserId,
                BlogId = blogId
            };
            if (existingReaction == null)
            {


                // Upvote the blog
                newReaction.Downvote = true;
				newReaction.CreatedAt = DateTime.Now;

				// Add the new Reaction to DbContext and save changes
				_context.Reactions.Add(newReaction);
            }
            else
            {
                if (existingReaction.Downvote)
                {
                    // If user previously upvoted, toggle off the upvote
                    existingReaction.Downvote = false;
                }
                else
                {
                    // If user previously downvoted or had no reaction, toggle on the upvote
                    existingReaction.Downvote = true;
					existingReaction.CreatedAt = DateTime.Now;
					existingReaction.Upvote = false; // Reset downvote if applicable
                }
            }
			await _context.SaveChangesAsync();

			int updatedBlogPopularity = BlogPopularityCalculator.CalculateBlogPopularity(blogId, _context.Reactions, _context.Comments);

            // Update the BlogPopularity property of the blog post
            blog.BlogPopularity = updatedBlogPopularity;
            // Save changes to persist the new comment in the database
            await _context.SaveChangesAsync();

            return Ok(); // Return 200 OK if the comment was added successfully
        }

		[HttpGet("downvoteCount/{blogId}")]
		public async Task<ActionResult> GetDownvoteCount(int blogId)
		{

			int downvotes = _context.Reactions.Count(r => r.BlogId == blogId && r.Downvote);



			return Ok(downvotes);
		}

		[HttpGet]
		[Route("BlogsByPopularity")]
		public async Task<IActionResult> GetBlogsByPopularity()
		{
			try
			{
				var activeBlogs = await _context.Blog.Include(blog => blog.User) // Include the User navigation property
					.OrderByDescending(blog => blog.BlogPopularity) // Order by Popularity (highest to lowest)
					.Select(blog => new
					{
						BlogId = blog.BlogId,
						Title = blog.Title,
						Body = blog.Body,
						CreatedAt = blog.CreatedAt,
                        BlogPopularity = blog.BlogPopularity,
						ImageName = blog.ImageName,
						ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, blog.ImageName)
			        })
					.ToListAsync();

				return Ok(activeBlogs); // Return the list of active blogs by popularity with user details
			}
			catch (Exception ex)
			{
				return StatusCode(500, "An error occurred while fetching the active blogs by popularity."); // Return an error response
			}
		}

		[HttpGet]
		[Route("Recency")]
		public async Task<IActionResult> GetRecentBlogs()
		{
			// Order blogs by CreatedAt in descending order
			var blogs = await _context.Blog.OrderByDescending(b => b.CreatedAt).Select(blog => new
			{
				BlogId = blog.BlogId,
				Title = blog.Title,
				Body = blog.Body,
				CreatedAt = blog.CreatedAt,
				BlogPopularity = blog.BlogPopularity,
				ImageName = blog.ImageName,
				ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, blog.ImageName)
			}).ToListAsync();
			return Ok(blogs);
		}

		[HttpGet]
		[Route("RandomBlogs")]
		public async Task<IActionResult> GetRandomBlogs()
		{
			try
			{
				var activeBlogs = await _context.Blog.Include(blog => blog.User) // Include the User navigation property
					.OrderBy(o => Guid.NewGuid()) // Order by Popularity (highest to lowest)
					.Select(blog => new
					{
						BlogId = blog.BlogId,
						Title = blog.Title,
						Body = blog.Body,
						CreatedAt = blog.CreatedAt,
						BlogPopularity = blog.BlogPopularity,
						ImageName = blog.ImageName,
						ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, blog.ImageName)
					})
					.ToListAsync();

				return Ok(activeBlogs); // Return the list of random active blogs with user details
			}
			catch (Exception ex)
			{
				return StatusCode(500, "An error occurred while fetching the random active blogs."); // Return an error response
			}
		}

		private bool BlogExists(int id)
        {
            return _context.Blog.Any(e => e.BlogId == id);
        }
    }
}
