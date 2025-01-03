﻿using AutoMapper;
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
		public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDto userRegistration)
		{
			var userResult = await _repository.UserAuthentication.RegisterUserAsync(userRegistration);
			return !userResult.Succeeded ? new BadRequestObjectResult(userResult) : StatusCode(201);
		}
	


		[HttpPost("login")]
        
        public async Task<IActionResult> Authenticate([FromBody] UserLoginDto user)
        {
            return !await _repository.UserAuthentication.ValidateUserAsync(user)
                ? Unauthorized()
                : Ok(new { Token = await _repository.UserAuthentication.CreateTokenAsync() });
        }
		[HttpPost("forgot-password/{email}")]
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
		public async Task<IActionResult> ChangePassowrd([FromBody] ChangePasswordRequest request)
		{
			await _repository.UserAuthentication.ChangePassowrd(request.userId,request.CurrentPassword, request.NewPassword);
			return Ok("Password changed successfully.");
		}

		public class ChangePasswordRequest
		{
			public string userId { get; set; }
			public string CurrentPassword { get; set; }
			public string NewPassword { get; set; }
		}
	}
}
