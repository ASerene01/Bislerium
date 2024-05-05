using AutoMapper;
using Bislerium.Dtos;
using Bislerium.Models;

namespace Bislerium.Mapping
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<UserRegistrationDto, User>();
        }
    }
}
