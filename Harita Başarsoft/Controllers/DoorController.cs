using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Harita_Başarsoft.Models.Class;
namespace Harita_Başarsoft.Controllers
{
    public class DoorController : Controller
    {
        Context point = new Context();
        // GET: Door
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult SavePoint()
        {
            return Json("");
        }
        [HttpGet]
        public JsonResult Listkapi()
        {
            var coordinates = point.Doors.ToList();
            return Json(coordinates, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SavePoint(Door door, float x, float y, string no, int Street_No)
        {
            if (ModelState.IsValid)
            {
                door.Door_No = no;
                door.X = x;
                door.Y = y;
                door.Street_No = Street_No;
                point.Doors.Add(door);
                point.SaveChanges();
            }
            return Json("");
        }
    }

}