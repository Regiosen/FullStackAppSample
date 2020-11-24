using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SQLite;

namespace FullStackAppSample.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly ILogger<StudentController> _logger;

        public StudentController(ILogger<StudentController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Student> Get()
        {
            string cs = @"Database\sample.db3;";
            string newPath = Path.GetFullPath(Path.Combine(@".\", cs));
            newPath = "Data Source=" + newPath;
            using var con = new SQLiteConnection(newPath);
            con.Open();

            string stm = "SELECT * FROM Student";

            using var cmd = new SQLiteCommand(stm, con);
            using SQLiteDataReader rdr = cmd.ExecuteReader();
            List<Student> AllStuddents = new List<Student>();
            while (rdr.Read())
            {
                AllStuddents.Add(new Student() { Id = rdr.GetInt32(0),
                                                 Username = rdr.GetString(1),
                                                 FirstName = rdr.GetString(2),
                                                 LastName = rdr.GetString(3),
                                                 Age = rdr.GetInt32(4),
                                                 Career = rdr.GetString(5) });
            }
            return AllStuddents;
        }
        [HttpPost]
        [Route("delete")]
        public Student Delete([FromBody] Student student)
        {
            string cs = @"Database\sample.db3;";
            string newPath = Path.GetFullPath(Path.Combine(@".\", cs));
            newPath = "Data Source=" + newPath;
            using var con = new SQLiteConnection(newPath);
            con.Open();

            using var cmd = new SQLiteCommand(con);
            cmd.CommandText = "DELETE FROM Student WHERE Id = @Id"; 
            cmd.Parameters.AddWithValue("@Id", student.Id);

            cmd.Prepare();

            cmd.ExecuteNonQuery();

            Console.WriteLine("row deleted");
            return new Student();
        }
        [HttpPost]
        [Route("insert")]
        public Student Insert([FromBody] StudentInput newStudent)
        {
            string cs = @"Database\sample.db3;";
            string newPath = Path.GetFullPath(Path.Combine(@".\", cs));
            newPath = "Data Source=" + newPath;
            using var con = new SQLiteConnection(newPath);
            con.Open();
            var age = Int32.Parse(newStudent.Age);
            using var cmd = new SQLiteCommand(con);
            cmd.CommandText = "INSERT INTO Student(Username, FirstName, LastName, Age, Career) VALUES(@Username, @FirstName, @LastName, @Age, @Career)";

            cmd.Parameters.AddWithValue("@Username", newStudent.Username);
            cmd.Parameters.AddWithValue("@FirstName", newStudent.FirstName);
            cmd.Parameters.AddWithValue("@LastName", newStudent.LastName);
            cmd.Parameters.AddWithValue("@Age", age);
            cmd.Parameters.AddWithValue("@Career", newStudent.Career);

            cmd.Prepare();

            cmd.ExecuteNonQuery();

            Console.WriteLine("row inserted");
            return new Student();
        }
        [HttpPost]
        [Route("modify")]
        public Student Modify([FromBody] StudentInput modifiedStudent)
        {
            string cs = @"Database\sample.db3;";
            string newPath = Path.GetFullPath(Path.Combine(@".\", cs));
            newPath = "Data Source=" + newPath;
            using var con = new SQLiteConnection(newPath);
            con.Open();
            var age = Int32.Parse(modifiedStudent.Age);
            using var cmd = new SQLiteCommand(con);
            cmd.CommandText = "UPDATE Student SET Username = @Username, FirstName = @FirstName, LastName = @LastName, Age = @Age, Career = @Career WHERE Id = @Id"; 

            cmd.Parameters.AddWithValue("@Username", modifiedStudent.Username);
            cmd.Parameters.AddWithValue("@FirstName", modifiedStudent.FirstName);
            cmd.Parameters.AddWithValue("@LastName", modifiedStudent.LastName);
            cmd.Parameters.AddWithValue("@Age", age);
            cmd.Parameters.AddWithValue("@Career", modifiedStudent.Career);
            cmd.Parameters.AddWithValue("@Id", modifiedStudent.Id);

            cmd.Prepare();

            cmd.ExecuteNonQuery();

            Console.WriteLine("row inserted");
            return new Student();
        }
    }
}
