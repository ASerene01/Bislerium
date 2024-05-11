using Bislerium.Data;
using Bislerium.Dtos;
using Bislerium.Interfaces;
using Bislerium.Models;
using Bislerium.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;

namespace Bislerium.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UserController : ControllerBase
	{
		private readonly AppDbContext _dbContext;
		protected readonly IRepositoryManager _repository;
		//private IConfiguration _configuration;
		private readonly UserManager<User> _userManager;

		public UserController(AppDbContext dbContext, UserManager<User> userManager, IRepositoryManager repositoryManager)
		{
			_dbContext = dbContext;
			_userManager = userManager;
			_repository = repositoryManager;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
		{
			var users = await _userManager.Users.ToListAsync();
			return Ok(users);
		}

		[HttpPut]
		[Route("UpdateUser")]
		public async Task<IActionResult> UpdateUser(UserRegistrationDto updatedUser)
		{
			var userID = _repository.UserAuthentication.GetCurrentUserId();	
			var user = await _userManager.FindByIdAsync(userID);

			if (user == null)
			{
				return NotFound(); // User not found
			}

			// Update the properties of the existing user with the values from the updatedUser
			user.FirstName = updatedUser.FirstName ?? user.FirstName;
			user.LastName = updatedUser.LastName ?? user.LastName;
			user.Email = updatedUser.Email ?? user.Email;
			user.PhoneNumber = updatedUser.PhoneNumber ?? user.PhoneNumber;
			user.UserName = updatedUser.UserName ?? user.UserName;

			try
			{
				// Update user in the database
				var result = await _userManager.UpdateAsync(user);

				if (!result.Succeeded)
				{
					// If the update operation fails, return error messages
					return BadRequest(result.Errors);
				}

				return Ok(user); // Return the updated user
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}

		[HttpPut]
		[Route("ChangePassword")]
		public async Task<IActionResult> ChangePassword(string oldPassword, string newPassword)
		{
			var userID = _repository.UserAuthentication.GetCurrentUserId();
			var user = await _userManager.FindByIdAsync(userID);

			if (user == null)
			{
				return NotFound(); // User not found
			}

			// Change password using UserManager
			var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);

			if (!result.Succeeded)
			{
				// If the change password operation fails, return error messages
				return BadRequest(result.Errors);
			}

			return Ok("Password changed successfully");
		}


		[HttpDelete]
		[Route("DeleteUser")]
		public async Task<IActionResult> DeleteUser()
		{
			var userID = _repository.UserAuthentication.GetCurrentUserId();	
			var user = await _userManager.FindByIdAsync(userID);

			if (user == null)
			{
				return NotFound(userID); // User not found
			}

			try
			{
				// Delete user from the database
				var result = await _userManager.DeleteAsync(user);

				if (!result.Succeeded)
				{
					// If the delete operation fails, return error messages
					return BadRequest(result.Errors);
				}

				return Ok("User deleted successfully");
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}

		[HttpGet]
		[Route("GetUser")]
		public async Task<IActionResult> GetUserById()
		{
			//var userID = _userAuthenticationRepository.GetUserId();
			var userID = _repository.UserAuthentication.GetCurrentUserId(); ;
			var user = await _userManager.FindByIdAsync(userID);

			if (user == null)
			{
				return NotFound(); // User not found
			}

			return Ok(user);
		}



	}

}
