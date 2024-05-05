using System.ComponentModel.DataAnnotations;

namespace Bislerium.Models
{
    public class Blog
    {
        [Key]
        public int BlogId { get; set; }

        public string Title { get; set; }

        public string Body { get; set; }



    }
}
