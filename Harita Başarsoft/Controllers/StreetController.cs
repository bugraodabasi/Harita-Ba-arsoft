using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Harita_Başarsoft.Models.Class;

namespace Harita_Başarsoft.Controllers
{
    public class StreetController : Controller
    {
        Context street = new Context();
        // GET: Street
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult SavePolygon()
        {
            return Json("");
        }
        [HttpGet]
        public JsonResult Listmahalle()
        {
            var coordinates = street.Streets.ToList();
            return Json(coordinates, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SavePolygon(Street _street, string no, string name, string coordinates)
        {
            if (ModelState.IsValid)
            {

                _street.Street_No = no;
                _street.Street_Name= name;
                _street.Street_Coordinates = coordinates;
                street.Streets.Add(_street);
                street.SaveChanges();
            }
            return Json("");
        }

    }
}