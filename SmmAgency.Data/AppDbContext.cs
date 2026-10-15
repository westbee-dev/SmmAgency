using System;
using SmmAgency.Core.Entity;
using Microsoft.EntityFrameworkCore;
using SmmAgency.Core.Entities;

namespace SmmAgency.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Blogger> Bloggers { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<PostStat> PostStats { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
