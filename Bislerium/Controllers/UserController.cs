using Bislerium.Data;
using Bislerium.Interfaces;
using Bislerium.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;

namespace Bislerium.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UserController : ControllerBase
	{
		private readonly AppDbContext _context;

		protected readonly IRepositoryManager _repository;
		private readonly string _from;
		private readonly SmtpClient _client;
		public UserController(AppDbContext context, IRepositoryManager repositoryManager)
		{
			_context = context;
			_repository = repositoryManager;
		}

		[HttpGet]
		public async Task<ActionResult<User>> GetUserProfile()
		{
			string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();

			var user = await _context.Users.FindAsync(getCurrentUserId);

			
			return user;
		}

		// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
		[HttpPut]
		public async Task<IActionResult> PutUser(User user)
		{
			string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();
			
			_context.Entry(user).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!UserExists(getCurrentUserId))
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

		[HttpDelete]
		
		public async Task<IActionResult> DeleteUser()
		{
			string getCurrentUserId = _repository.UserAuthentication.GetCurrentUserId();

			var user = await _context.Users.FindAsync(getCurrentUserId);
			if (user == null)
			{
				return NotFound();
			}

			_context.Users.Remove(user);
			await _context.SaveChangesAsync();

			return NoContent();
		}




		private bool UserExists(string id)
		{
			return _context.Users.Any(e => e.Id == id);
		}

	}
}
