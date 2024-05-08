using System;
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

namespace Bislerium.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        protected readonly IRepositoryManager _repository;
        public BlogsController(AppDbContext context, IRepositoryManager repositoryManager)
        {
            _context = context;
            _repository = repositoryManager;
        }

        // GET: api/Blogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlog()
        {
            return await _context.Blog.ToListAsync();
        }

        // GET: api/Blogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Blog>> GetBlog(int id)
        {
            var blog = await _context.Blog.FindAsync(id);

            if (blog == null)
            {
                return NotFound();
            }

            return blog;
        }

        // PUT: api/Blogs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Blogger")]
        public async Task<IActionResult> PutBlog(int id, Blog blog)
        {
            if (id != blog.BlogId)
            {
                return BadRequest();
            }

            _context.Entry(blog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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
        [Authorize(Roles = "Admins,Blogger")]
        public async Task<ActionResult<Blog>> PostBlog(Blog blog)
        {
            string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();
            blog.BloggerId= getCurrentUserId; 
            _context.Blog.Add(blog);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBlog", new { id = blog.BlogId }, blog);
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
            blog.Comments ??= new List<Comment>(); // Ensure Comments collection is initialized
            blog.Comments.Add(newComment);// Add the new comment to the blog's Comments collection

            // Save changes to persist the new comment in the database
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
                    existingReaction.Downvote = false; // Reset downvote if applicable
                }
            }

            int updatedBlogPopularity = BlogPopularityCalculator.CalculateBlogPopularity(blogId, _context.Reactions, _context.Comments);

            // Update the BlogPopularity property of the blog post
            blog.BlogPopularity = updatedBlogPopularity;

            // Save changes to persist the new comment in the database
            await _context.SaveChangesAsync();

            return Ok(); // Return 200 OK if the comment was added successfully
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

                // Add the new Reaction to DbContext and save changes
                _context.Reactions.Add(newReaction);
            }
            else
            {
                if (existingReaction.Upvote)
                {
                    // If user previously upvoted, toggle off the upvote
                    existingReaction.Downvote = false;
                }
                else
                {
                    // If user previously downvoted or had no reaction, toggle on the upvote
                    existingReaction.Downvote = true;
                    existingReaction.Upvote = false; // Reset downvote if applicable
                }
            }

            int updatedBlogPopularity = BlogPopularityCalculator.CalculateBlogPopularity(blogId, _context.Reactions, _context.Comments);

            // Update the BlogPopularity property of the blog post
            blog.BlogPopularity = updatedBlogPopularity;
            // Save changes to persist the new comment in the database
            await _context.SaveChangesAsync();

            return Ok(); // Return 200 OK if the comment was added successfully
        }

        private bool BlogExists(int id)
        {
            return _context.Blog.Any(e => e.BlogId == id);
        }
    }
}
