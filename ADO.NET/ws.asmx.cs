using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Configuration;


namespace ProektEmploee
{
    /// <summary>
    /// Summary description for ws
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class ws : System.Web.Services.WebService
    {


        [WebMethod]
        public string AddEmployee(Employee emp)
        {
            List<Employee> listEmployees = new List<Employee>();
            Dictionary<string, string> errorDic = new Dictionary<string, string>();
            string cs = ConfigurationManager.ConnectionStrings["conn"].ConnectionString;
            string query = "INSERT INTO tblMyFirstApp (fio,age,adres,gender)" + " VALUES (@fio,@age,@adres,@gender);select SCOPE_IDENTITY() as cur_id";
           // string q = "select * from tblMyFirstApp where id=cur_id";   //select SCOPE_IDENTITY() as cur_id"; ;
            using (SqlConnection connection = new SqlConnection(cs))  //  select @newId = Scope_Identity() 
            using (SqlCommand command = new SqlCommand(query, connection))
            
            {
                try
                {
                    //string id = command.Rows[0]["cur_id"].ToString();             
                    command.Parameters.Add("@fio", SqlDbType.NVarChar).Value = emp.fio;
                    command.Parameters.Add("@age", SqlDbType.Int).Value = emp.age;
                    command.Parameters.Add("@adres", SqlDbType.NVarChar).Value = emp.adres;
                    command.Parameters.Add("@gender", SqlDbType.NVarChar).Value = emp.gender;
                    
                    
                    connection.Open();
                    SqlDataAdapter da = new SqlDataAdapter(command);
                    DataTable dt = new DataTable();
                    da.Fill(dt);
                    int curr_id = (dt.Rows.Count > 0) ? Convert.ToInt32(dt.Rows[0]["cur_id"]) : -1;

                    connection.Close();

                    if (curr_id != 0) {
                        string result = GetAllEmployees(" where id="+curr_id,"");
                        errorDic["ErrorMessage"] = "insert";
                        errorDic["InsData"] = result;
                    }
                 

                }
                catch(Exception ex)
                {
                    errorDic["ErrorMessage"] = ex.Message;
                }

                JavaScriptSerializer js = new JavaScriptSerializer();
                return js.Serialize(errorDic);
            }

        }

         [WebMethod]
        public void database()
        {
            List<Employee> listEmployees = new List<Employee>();

            string cs = ConfigurationManager.ConnectionStrings["conn"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {                                       //  Select * from tblMyFirstApp " + where + " order by fio " + orderBy where fio like "+f1+" and age=3
                SqlCommand cmd = new SqlCommand("Select * from tblMyFirstApp", con);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Employee employee = new Employee();
                    employee.ID = Convert.ToInt32(rdr["ID"]);
                    employee.fio = rdr["fio"].ToString();
                    employee.age = Convert.ToInt32(rdr["age"]);
                    employee.adres = rdr["adres"].ToString();
                    employee.gender = rdr["gender"].ToString();
                    listEmployees.Add(employee);
                }
            }

            JavaScriptSerializer js = new JavaScriptSerializer();
            Context.Response.Write(js.Serialize(listEmployees));
        }
        

        [WebMethod]
        public string GetAllEmployees(string where,string orderBy)
        {
            List<Employee> listEmployees = new List<Employee>();

            string cs = ConfigurationManager.ConnectionStrings["conn"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {                                       //where fio like "+f1+" and age=3
                SqlCommand cmd = new SqlCommand("Select * from tblMyFirstApp "+where+" order by fio "+orderBy, con);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Employee employee = new Employee();
                    employee.ID = Convert.ToInt32(rdr["ID"]);
                    employee.fio = rdr["fio"].ToString();
                    employee.age = Convert.ToInt32(rdr["age"]);
                    employee.adres = rdr["adres"].ToString();
                    employee.gender = rdr["gender"].ToString();
                    listEmployees.Add(employee);
                }
            }

            JavaScriptSerializer js = new JavaScriptSerializer();
            return js.Serialize(listEmployees);
                
            //Context.Response.Write(js.Serialize(listEmployees));
        }

        [WebMethod]
        public string delete(int indxId)  //static void delete(string indxId)  void delete(Employee emp)
        {
            Dictionary<string, string> errorDic = new Dictionary<string, string>();
            string cs = ConfigurationManager.ConnectionStrings["conn"].ConnectionString;
            using (SqlConnection connection = new SqlConnection(cs))
            using (SqlCommand command = new SqlCommand("DELETE FROM tblMyFirstApp WHERE ID = @index ", connection))
                try
                {    // + emp.index

                    command.Parameters.Add("@index", SqlDbType.Int).Value = indxId;

                    connection.Open();

                    command.ExecuteNonQuery();
                    connection.Close();
                   // Error.Add("Er", "Delete");
                    errorDic["ErrorMessage"] = "delete";
                }

                catch (Exception error)
                {
                    errorDic["ErrorMessage"]=error.Message;
                  //  Error.Add("Er", "No Delete");
                    //Console.WriteLine("Ошибка:" + error.Message);
                }

           // List<Dictionary<string, string>> list = new List<Dictionary<string, string>>();
            //list.Add(Error);
              
                    
            JavaScriptSerializer js = new JavaScriptSerializer();
            return js.Serialize(errorDic);
            
        }
        
        [WebMethod]
        public string Update(Employee emp)
        {
            
            Dictionary<string, string> errorDic = new Dictionary<string, string>();
           
           
            string query = "update tblMyFirstApp set fio=@fio , age=@age , adres=@adres,  gender=@gender  where id=" + emp.ID;

            string cs = ConfigurationManager.ConnectionStrings["conn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(cs))
            using (SqlCommand command = new SqlCommand(query, connection))
                    try
                {
                   
                    command.Parameters.Add("@fio", SqlDbType.NVarChar).Value = emp.fio;
                    command.Parameters.Add("@age", SqlDbType.Int).Value = emp.age;
                    command.Parameters.Add("@adres", SqlDbType.NVarChar).Value = emp.adres;
                    command.Parameters.Add("@gender", SqlDbType.NVarChar).Value = emp.gender;

                  
                    connection.Open();
                                         
                    command.ExecuteNonQuery();                   
                  
                    connection.Close();
                    string resultup = GetAllEmployees(" where id=" + emp.ID, "");
                         errorDic["ErrorMessage"]="Update";
                         errorDic["idupdate"] = resultup;
                }

                catch (Exception error)
                {
                    errorDic["ErrorMessage"]=error.Message;
                   
                }
                             
            
            JavaScriptSerializer js = new JavaScriptSerializer();
            return js.Serialize(errorDic);

        }
        
    
    }
}
