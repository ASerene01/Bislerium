using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Bislerium.Data;
using Bislerium.Models;

namespace Bislerium.Services
{
	public class SeedDbContext
	{

			private AppDbContext _context;

			public SeedDbContext(AppDbContext context)
			{
				_context = context;
			}

			public async void SeedAdminUser()
			{
				var user = new User
				{
					UserName = "Admin",
					NormalizedUserName = "email@email.com",
					Email = "Email@email.com",
					NormalizedEmail = "email@email.com",
					EmailConfirmed = true,
					LockoutEnabled = false,
					SecurityStamp = Guid.NewGuid().ToString()
				};

				var roleStore = new RoleStore<IdentityRole>(_context);

				if (!_context.Roles.Any(r => r.Name == "admin"))
				{
					await roleStore.CreateAsync(new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" });
				}

				if (!_context.Users.Any(u => u.UserName == user.UserName))
				{
					var password = new PasswordHasher<User>();
					var hashed = password.HashPassword(user, "Admin");
					user.PasswordHash = hashed;
					var userStore = new UserStore<User>(_context);
					await userStore.CreateAsync(user);
					await userStore.AddToRoleAsync(user, "admin");
				}

				await _context.SaveChangesAsync();
			}
		}
}
