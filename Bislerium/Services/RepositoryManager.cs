﻿using AutoMapper;
using Bislerium.Data;
using Bislerium.Interfaces;
using Bislerium.Models;
using Microsoft.AspNetCore.Identity;

namespace Bislerium.Services
{
    public class RepositoryManager: IRepositoryManager
    {
        private AppDbContext _repositoryContext;

        
        private IUserAuthenticationRepository _userAuthenticationRepository;
        private UserManager<User> _userManager;
        private IMapper _mapper;
        private IConfiguration _configuration;
        private RoleManager<IdentityRole> _rolemanager;
        private IHttpContextAccessor _contextAccessor;
		private IEmailService _emailService;
		public RepositoryManager(AppDbContext repositoryContext, UserManager<User> userManager, IMapper mapper, IConfiguration configuration, RoleManager<IdentityRole> roleManager, IHttpContextAccessor httpContextAccessor, IEmailService emailService)
        {
            _repositoryContext = repositoryContext;
            _userManager = userManager;
            _mapper = mapper;
            _configuration = configuration;
            _rolemanager = roleManager;
            _contextAccessor = httpContextAccessor;
            _emailService = emailService;
        }

        
        public IUserAuthenticationRepository UserAuthentication
        {
            get
            {
                if (_userAuthenticationRepository is null)
                    _userAuthenticationRepository = new UserAuthenticationRepository(_userManager, _mapper,_rolemanager,_configuration, _contextAccessor,_emailService);
                return _userAuthenticationRepository;
            }
        }
        public Task SaveAsync() => _repositoryContext.SaveChangesAsync();
    }
}
