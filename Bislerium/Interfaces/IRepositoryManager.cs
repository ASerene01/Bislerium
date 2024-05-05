namespace Bislerium.Interfaces
{
    public interface IRepositoryManager
    {
        IUserAuthenticationRepository UserAuthentication { get; }
        Task SaveAsync();
    }
}
