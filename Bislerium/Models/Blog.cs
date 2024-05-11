using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bislerium.Models
{
    public class Blog
    {
        [Key]
        public int BlogId { get; set; }

        public string Title { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string Body { get; set; }

        public string? BloggerId { get; set; } 

        public int BlogPopularity { get; set; } = 0;
        public User? User { get; set; }

		[Column(TypeName = "nvarchar(100)")]
		public string? ImageName { get; set; }

		[NotMapped]
		public IFormFile? ImageFile { get; set; }

		[NotMapped]
		public string? ImageSrc { get; set; }

        

    }
}
