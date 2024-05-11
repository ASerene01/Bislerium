using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bislerium.Data;
using Bislerium.Models;

using NuGet.Protocol.Core.Types;
using Bislerium.Interfaces;
using Bislerium.Services;
using System.Reflection.Metadata;

namespace Bislerium.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        protected readonly IRepositoryManager _repository;
        public CommentsController(AppDbContext context, IRepositoryManager repositoryManager)
        {
            _context = context;
            _repository = repositoryManager;
        }
        

        
        // PUT: api/Comments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(int id, Comment comment)
        {

			var existingComment = await _context.Comments.FindAsync(id);
			// Update the properties of the existing user with the values from the updatedUser
			existingComment.Content = comment.Content ?? existingComment.Content;
			
			_context.Entry(existingComment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
				return Ok();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id))
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



        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

		[HttpPost("{commentId}/downvote")]
		public async Task<ActionResult> Downvote(int commentId)
		{
			// Call the method to add the comment to the blog
			// Retrieve the blog from the database
			var blog = await _context.Comments.FindAsync(commentId);
			string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();
			var existingReaction = _context.CommentReactions.FirstOrDefault(r => r.UserId == getCurrentUserId && r.CommentId == commentId);
			// Create a new Reaction
			var newReaction = new CommentReaction
			{
				UserId = getCurrentUserId,
				CommentId = commentId
			};
			if (existingReaction == null)
			{


				// Upvote the blog
				newReaction.Downvote = true;
				newReaction.CreatedAt = DateTime.Now;

				// Add the new Reaction to DbContext and save changes
				_context.CommentReactions.Add(newReaction);
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

		
			// Save changes to persist the new comment in the database
			await _context.SaveChangesAsync();

			return Ok(); // Return 200 OK if the comment was added successfully
		}


		[HttpGet("downvoteCount/{commentId}")]
		public async Task<ActionResult> GetDownVote(int commentId)
		{

			int downvote = _context.CommentReactions.Count(r => r.CommentId == commentId && r.Downvote);
			return Ok(downvote);
		}

		[HttpPost("{commentId}/upvote")]
		public async Task<ActionResult> Upvote(int commentId)
		{
			// Call the method to add the comment to the blog
			// Retrieve the blog from the database
			var blog = await _context.Comments.FindAsync(commentId);
			string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();
			var existingReaction = _context.CommentReactions.FirstOrDefault(r => r.UserId == getCurrentUserId && r.CommentId == commentId);
			// Create a new Reaction
			var newReaction = new CommentReaction
			{
				UserId = getCurrentUserId,
				CommentId = commentId
			};
			if (existingReaction == null)
			{


				// Upvote the blog
				newReaction.Upvote = true;
				newReaction.CreatedAt = DateTime.Now;
				// Add the new Reaction to DbContext and save changes
				_context.CommentReactions.Add(newReaction);
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

			

			// Save changes to persist the new comment in the database
			await _context.SaveChangesAsync();

			return Ok(); // Return 200 OK if the comment was added successfully
		}

		[HttpGet("upvoteCount/{commentId}")]
		public async Task<ActionResult> GetUpvoteCount(int commentId)
		{

			int upvotes = _context.CommentReactions.Count(r => r.CommentId == commentId && r.Upvote);



			return Ok(upvotes);
		}

		private bool CommentExists(int id)
        {
            return _context.Comments.Any(e => e.CommentId == id);
        }
    }
}
	
