using AutoMapper;
using Bislerium.Dtos;
using Bislerium.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bislerium.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseApiController
    {
        public AuthController(IRepositoryManager repository, IMapper mapper) : base(repository, mapper)
        {
        }
		[HttpPost("register")]
		public async Task<IActionResult> RegisterUser([FromForm] UserRegistrationDto userRegistration)
		{
			if (!ModelState.IsValid)
			{
				var errors = ModelState.Where(x => x.Value != null && x.Value.Errors.Count > 0)
					.ToDictionary(
						x => x.Key,
						x => x.Value.Errors.Select(y => y.ErrorMessage).ToArray()
					);
				return BadRequest(errors);
			}

			var userResult = await _repository.UserAuthentication.RegisterUserAsync(userRegistration);

			if (!userResult.Succeeded)
			{
				var errors = userResult.Errors.GroupBy(x => x.Code)
					.ToDictionary(
						x => x.Key,
						x => x.Select(y => y.Description).ToArray()
					);
				return BadRequest(errors);
			}

			return StatusCode(201);
		}


		[HttpPost("login")]
        
        public async Task<IActionResult> Authenticate([FromBody] UserLoginDto user)
        {
            return !await _repository.UserAuthentication.ValidateUserAsync(user)
                ? Unauthorized()
                : Ok(new { Token = await _repository.UserAuthentication.CreateTokenAsync() });
        }
		[HttpPost("forgot-password")]
		public async Task<IActionResult> ForgotPassword(string email)
		{
			await _repository.UserAuthentication.ForgotPassword(email);
			return Ok("Password reset email sent successfully.");
		}

		[HttpPost("reset-password")]
		public async Task<IActionResult> ResetPassword(string email, string token, string newPassword)
		{
			await _repository.UserAuthentication.ResetPassword(email, token, newPassword);
			return Ok("Password reset successful.");
		}

		[HttpPost("change-password")]
		public async Task<IActionResult> ChangePassowrd(string currentPassword, string newPassword)
		{
			await _repository.UserAuthentication.ChangePassowrd(currentPassword, newPassword);
			return Ok("Password changed successfully.");
		}
	}
}
