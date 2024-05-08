using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Bislerium.Models;

namespace Bislerium.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {

        }


        public DbSet<Blog> Blog { get; set; } = default!;
        public DbSet<Comment> Comments { get; set; }

        public DbSet<Reaction> Reactions { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed roles
            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "1", Name = "Admins", NormalizedName = "ADMINS" },
                new IdentityRole { Id = "2", Name = "Blogger", NormalizedName = "BLOGGER" },
                new IdentityRole { Id = "3", Name = "Surfer", NormalizedName = "SURFER" }
            );
        }

    }
}
