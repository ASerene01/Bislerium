﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
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
		public DbSet<CommentReaction> CommentReactions { get; set; }
		public DbSet<User> Users { get; set; }
		
		protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed roles
            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "1", Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Id = "2", Name = "Blogger", NormalizedName = "BLOGGER" },
                new IdentityRole { Id = "3", Name = "Surfer", NormalizedName = "SURFER" }
                
            );
         
        }

    }
}
