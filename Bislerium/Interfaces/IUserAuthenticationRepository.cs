using Bislerium.Dtos;
using Bislerium.Models;
using Microsoft.AspNetCore.Identity;

namespace Bislerium.Interfaces
{
    public interface IUserAuthenticationRepository
    {
        Task<IdentityResult> RegisterUserAsync(UserRegistrationDto userForRegistration);
        Task<bool> ValidateUserAsync(UserLoginDto loginDto);
        Task<string> CreateTokenAsync();
		Task ForgotPassword(string email);
		Task ChangePassowrd(string userId, string currentPassword, string newPassword);
		Task ResetPassword(string email, string token, string password);
		string GetCurrentUserId();
    }
}
