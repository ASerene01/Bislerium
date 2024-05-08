using Bislerium.Constants;
using Bislerium.Data;
using Bislerium.Extensions;
using Bislerium.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AppConnectionString")));

builder.Services.AddAuthentication();
builder.Services.ConfigureIdentity();
builder.Services.ConfigureMapping();
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.AddHttpContextAccessor();

builder.Services.AddEndpointsApiExplorer();

builder.Services.ConfigureSwagger();    
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:3000/")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");



app.MapControllers();



app.Run();



