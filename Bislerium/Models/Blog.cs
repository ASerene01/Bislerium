using System.ComponentModel.DataAnnotations;

namespace Bislerium.Models
{
    public class Blog
    {
        [Key]
        public int BlogId { get; set; }

        public string Title { get; set; }

        public DateTime CreatedAt { get; set; }
        public string Body { get; set; }

        public string? BloggerId { get; set; }

        public int BlogPopularity { get; set; } = 0;
        public User? User { get; set; }

        public List<Comment>? Comments { get; set; }

        public Blog()
        {
            CreatedAt = DateTime.UtcNow; 
        }

    }
}
