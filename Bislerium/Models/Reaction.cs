using System.ComponentModel.DataAnnotations;

namespace Bislerium.Models
{
    public class Reaction
    {
        [Key]
        public int ReactionId { get; set; }

        public bool Upvote { get; set; } = false;
        public bool Downvote { get; set; } = false;

        public string? UserId { get; set; }
        public User? User { get; set; }

        public int? BlogId { get; set; }
        public Blog? Blog { get; set; }


    }
}
