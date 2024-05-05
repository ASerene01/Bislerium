using AutoMapper;
using Bislerium.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bislerium.Controllers
{
    
    public class BaseApiController : ControllerBase
    {
        protected readonly IRepositoryManager _repository;

        protected readonly IMapper _mapper;

        public BaseApiController(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
    }
}
