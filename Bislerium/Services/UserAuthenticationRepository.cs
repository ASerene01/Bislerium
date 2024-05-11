using AutoMapper;
using Bislerium.Dtos;
using Bislerium.Interfaces;
using Bislerium.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NuGet.Protocol.Core.Types;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Bislerium.Services
{
    internal sealed class UserAuthenticationRepository : IUserAuthenticationRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly RoleManager<IdentityRole> _roleManager;
        private User? _user;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

		private readonly IEmailService _emailService;

		public UserAuthenticationRepository(
        UserManager<User> userManager, IMapper mapper, RoleManager<IdentityRole> roleManager, IConfiguration configuration,IHttpContextAccessor httpContextAccessor, IEmailService emailService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _roleManager = roleManager;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
             

    }


        public async Task<IdentityResult> RegisterUserAsync(UserRegistrationDto userRegistration)
        {
            var user = _mapper.Map<User>(userRegistration);
            var result = await _userManager.CreateAsync(user, userRegistration.Password);
            if(result.Succeeded)
            {
                await AssignRoleToUser(user,userRegistration.Role);
            }
            return result;
        }

        private async Task AssignRoleToUser(User user, string roleName)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                 throw new InvalidOperationException($"The role '{roleName}' does not exist.");
            }

            await _userManager.AddToRoleAsync(user, roleName);
        }

        public async Task<bool> ValidateUserAsync(UserLoginDto loginDto)
        {
            _user = await _userManager.FindByNameAsync(loginDto.UserName);
            var result = _user != null && await _userManager.CheckPasswordAsync(_user, loginDto.Password);
            return result;
        }

        public async Task<string> CreateTokenAsync()
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims();
            var tokenOptions = GenerateTokenOptions(signingCredentials, claims);
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
        private SigningCredentials GetSigningCredentials()
        {
            var jwtConfig = _configuration.GetSection("jwtConfig");
            var key = Encoding.UTF8.GetBytes(jwtConfig["Secret"]);
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

		private async Task<List<Claim>> GetClaims()
		{
			
			var claims = new List<Claim>
				{
			new Claim(ClaimTypes.Name, _user.Id),
			new Claim(ClaimTypes.NameIdentifier, _user.Id),
			new Claim("UserId", _user.Id),
			new Claim("Email", _user.Email),
			new Claim("FirstName", _user.FirstName),
			new Claim("LastName", _user.LastName),

};
			var roles = await _userManager.GetRolesAsync(_user);
			foreach (var role in roles)
			{
				claims.Add(new Claim(ClaimTypes.Role, role));
				claims.Add(new Claim("Role", role));
			}

			return claims;
		}

		private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JwtConfig");
            var tokenOptions = new JwtSecurityToken
            (
            issuer: jwtSettings["validIssuer"],
            audience: jwtSettings["validAudience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["expiresIn"])),
            signingCredentials: signingCredentials
            );
            return tokenOptions;
        }

        public string GetCurrentUserId()
        {
            var httpContext = _httpContextAccessor.HttpContext;
           
            if (httpContext != null)
            {
                 
                var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId != null)
                    return userId;
            }
        
            

            return "Hello";
            
        }


		public async Task ForgotPassword(string email)
		{
			var user = await _userManager.FindByEmailAsync(email);
			if (user != null)
			{
				var passwordResetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
				var token = ToUrlSafeBase64(passwordResetToken);
				await _emailService.SendForgotPasswordEmailAsync(user.FirstName, email, token);
			}
		}

		public async Task ResetPassword(string email, string token, string password)
		{
			var user = await _userManager.FindByEmailAsync(email);
			if (user != null)
			{
				var passwordResetToken = FromUrlSafeBase64(token);
				var result = await _userManager.ResetPasswordAsync(user, passwordResetToken, password);
                
				ValidateIdentityResult(result);
			}
		}
		public async Task ChangePassowrd(string userId, string currentPassword, string newPassword)
		{
			
			var user = await _userManager.FindByIdAsync(userId);
			if (user != null)
			{
				var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
				ValidateIdentityResult(result);
			}
		}

		private void ValidateIdentityResult(IdentityResult result)
		{
			if (!result.Succeeded)
			{
				var errors = result.Errors.Select(x => x.Description);
				throw new Exception(errors.ToString());
			}
		}

		private static string ToUrlSafeBase64(string base64String)
		{
			return base64String.Replace('+', '-').Replace('/', '_').Replace('=', '*');
		}

		private static string FromUrlSafeBase64(string urlSafeBase64String)
		{
			return urlSafeBase64String.Replace('-', '+').Replace('_', '/').Replace('*', '=');
		}

		
	}
}
