using Azure.Core;
using Bislerium.Data;
using Bislerium.Dtos;
using Bislerium.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AdminController : ControllerBase
	{


		private readonly AppDbContext _context;

		protected readonly IRepositoryManager _repository;
		public AdminController(AppDbContext context, IRepositoryManager repositoryManager)
		{
			_context = context;
			_repository = repositoryManager;
		}

		[HttpGet("all-time")]
		public async Task<ActionResult<SystemCountsDto>> GetSystemCounts()
		{
			try
			{
				var totalCounts = new SystemCountsDto();

				// Total count of blog posts
				totalCounts.TotalBlogPosts = await _context.Blog.CountAsync();

				// Total upvotes
				totalCounts.TotalUpvotes = await _context.Reactions.CountAsync(r => r.Upvote);

				// Total downvotes
				totalCounts.TotalDownvotes = await _context.Reactions.CountAsync(r => r.Downvote);

				// Total comments
				totalCounts.TotalComments = await _context.Comments.CountAsync();

				return Ok(totalCounts);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}
		[HttpGet("all-time-10-blogs")]
		public async Task<ActionResult<IEnumerable<TopPostDto>>> GetTopPostsAllTime()
		{
			var topPosts = await _context.Blog
				.OrderByDescending(b => b.BlogPopularity) 
				.Take(10)
				.Select(b => new TopPostDto
				{
					PostId = b.BlogId,
					Title = b.Title,
					TotalUpvotes = _context.Reactions.Count(r => r.BlogId == b.BlogId && r.Upvote),
					TotalDownvotes = _context.Reactions.Count(r => r.BlogId == b.BlogId && r.Downvote),
					TotalComments = _context.Comments.Count(c => c.BlogId == b.BlogId)
				})
				.ToListAsync();

			return Ok(topPosts);
		}

		[HttpGet("monthly-10-blogs")]
		public async Task<ActionResult<IEnumerable<TopPostDto>>> GetMonthlyTopPosts([FromQuery] MonthlyTopPostsRequestDto request)
		{
			var startDate = new DateTime(request.Year, request.Month, 1);
			var endDate = startDate.AddMonths(1).AddDays(-1);

			var topPosts = await _context.Blog
				.Where(b => b.CreatedAt >= startDate && b.CreatedAt <= endDate)
				.OrderByDescending(b => b.BlogPopularity)
				.Take(10)
				.Select(b => new TopPostDto
				{
					PostId = b.BlogId,
					Title = b.Title,
					TotalUpvotes = _context.Reactions
						.Count(r => r.BlogId == b.BlogId && r.Upvote && r.CreatedAt >= startDate && r.CreatedAt <= endDate),
					TotalDownvotes = _context.Reactions
						.Count(r => r.BlogId == b.BlogId && r.Downvote && r.CreatedAt >= startDate && r.CreatedAt <= endDate),
					TotalComments = _context.Comments
						.Count(c => c.BlogId == b.BlogId && c.CreatedAt >= startDate && c.CreatedAt <= endDate)
				})
				.ToListAsync();

			return Ok(topPosts);

		}


		[HttpGet("top-bloggers-10-month")]
		public async Task<ActionResult<IEnumerable<TopBloggerDto>>> GetMonthlyTopBloggers([FromQuery] MonthlyTopPostsRequestDto request)
		{
			// Calculate start and end dates for the specified month and year
			var startDate = new DateTime(request.Year, request.Month, 1);
			var endDate = startDate.AddMonths(1).AddDays(-1);

			var topBloggers = await _context.Users
				.Select(u => new TopBloggerDto
				{
					UserId = u.Id,
					Username = u.UserName,
					TotalPosts = _context.Blog
						.Count(b => b.BloggerId == u.Id && b.CreatedAt >= startDate && b.CreatedAt <= endDate), // Count posts by the user in the chosen month
					TotalUpvotesReceived = _context.Reactions
						.Where(r => r.Blog.BloggerId == u.Id && r.Upvote && r.CreatedAt >= startDate && r.CreatedAt <= endDate)
						.Count(), // Count upvotes on user's posts in the chosen month
					TotalCommentsReceived = _context.Comments
						.Where(c => c.Blog.BloggerId == u.Id && c.CreatedAt >= startDate && c.CreatedAt <= endDate)
						.Count() // Count comments on user's posts in the chosen month
				})
				.OrderByDescending(dto => dto.TotalPosts) // Order by total posts (or another metric)
				.Take(10)
				.ToListAsync();

			return Ok(topBloggers);
		}


		[HttpGet("top-bloggers-10")]
		public async Task<ActionResult<IEnumerable<TopBloggerDto>>> GetTopBloggers()
		{
			var topBloggers = await _context.Users
				.Select(u => new TopBloggerDto
				{
					UserId = u.Id,
					Username = u.UserName,
					TotalPosts = _context.Blog.Count(b => b.BloggerId == u.Id), // Count posts by the user
					TotalUpvotesReceived = _context.Reactions.Where(r => r.Blog.BloggerId == u.Id && r.Upvote).Count(), // Count upvotes on user's posts
					TotalCommentsReceived = _context.Comments.Where(c => c.Blog.BloggerId == u.Id).Count() // Count comments on user's posts
				})
				.OrderByDescending(dto => dto.TotalPosts) // Order by total posts (or another metric)
				.Take(10)
				.ToListAsync();

			return Ok(topBloggers);
		}




		[HttpGet("monthly-daily-activity")]
		public async Task<ActionResult<IEnumerable<DailyActivityDto>>> GetMonthlyActivity([FromQuery] MonthlyTopPostsRequestDto request)
		{
			try
			{
				// Validate input parameters (e.g., month, year)
				if (request.Month < 1 || request.Month > 12 || request.Year < 1900)
				{
					return BadRequest("Invalid month or year.");
				}

				// Calculate start and end dates for the specified month and year
				var startDate = new DateTime(request.Year, request.Month, 1);
				var endDate = startDate.AddMonths(1).AddDays(-1);

				// Retrieve daily activity metrics within the specified month
				var dailyActivity = await _context.Blog
					.Where(b => b.CreatedAt >= startDate && b.CreatedAt <= endDate)
					.Select(b => new DailyActivityDto
					{
						Date = b.CreatedAt.Date,
						BlogPostCount = _context.Blog.Count(blog => blog.CreatedAt.Date == b.CreatedAt.Date),
						UpvoteCount = _context.Reactions.Count(r => r.BlogId == b.BlogId && r.Upvote && r.CreatedAt.Date == b.CreatedAt.Date),
						DownvoteCount = _context.Reactions.Count(r => r.BlogId == b.BlogId && r.Downvote && r.CreatedAt.Date == b.CreatedAt.Date),
						CommentCount = _context.Comments.Count(c => c.BlogId == b.BlogId && c.CreatedAt.Date == b.CreatedAt.Date)
					})
					.ToListAsync();

				return Ok(dailyActivity);
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error.");
			}
		}



	}


}
	


