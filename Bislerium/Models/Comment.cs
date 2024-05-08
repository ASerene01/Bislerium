using System.ComponentModel.DataAnnotations;

namespace Bislerium.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? UserId { get; set; }
        public User? User { get; set; }

        public int BlogId { get; set; }
        public Blog? Blog { get; set; }
        public Comment()
        {
            CreatedAt = DateTime.UtcNow; // Set CreatedAt to current UTC date and time
        }
    }
}
