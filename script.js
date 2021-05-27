
var cl = new cloudinary.Cloudinary({cloud_name: "demo", secure: true});
var model = "cld-fashion"
var preset = "cld-fashion"
var demo_folder = "obj-ai"


document.getElementById("upload_widget").addEventListener("click", function(){
    checkModel();
    console.log("model: ",model," preset: ",preset);
    var myWidget = cloudinary.createUploadWidget({
    cloudName: 'demo', 
    uploadPreset: preset}, (error, result) => { 
    if (!error && result && result.event === "success") { 
      if(result.info.info.detection.object_detection.data[model].tags) {
        console.log(result.info.info.detection.object_detection.data[model].tags,result.info.public_id);
        createURL(result.info.info.detection.object_detection.data[model].tags,result.info.public_id);
      }
      else
        console.log("image analysis timeout");
    }
  }
)
    myWidget.open();
  }, false);


function createURL(tags,pid)
{
  const att = tags
  const color = ["red","blue","green","orange","yellow","olive","magenta","gray","pink","purple","brown","gold","khaki","lavender","navy","lightgreen"]
  let i = 0;
  global_trans = ""
  for (const [key, value] of Object.entries(att)) {
    var confidence = [];
    var x = [], y = [];
    var hight = [], width = [];
    var addtext = [], addtextloc = [], addimg = [], dimention = [], addborder = [];
    var raw_transformation = "";
    for (n = 0; n < value.length; n++)
    {
      console.log(key,value.length,value[n]['bounding-box'][0])
      confidence[n] = (Math.round(value[n]['confidence'] * 100) / 100).toFixed(2);
      x[n] = value[n]['bounding-box'][0]
      y[n] = value[n]['bounding-box'][1]
      width[n] = value[n]['bounding-box'][2]
      hight[n] = value[n]['bounding-box'][3] 
      addtext[n] = "l_text:arial_20:" + key + " " + confidence[n] + ",co_" + color[i] +",x_" + Math.round(x[n]) + ",y_" + Math.round(y[n]+20) 
      addtextloc[n] = "/g_north_west,x_" + Math.round(x[n]) + ",y_" + Math.round(y[n]-20) + ",fl_layer_apply"
      addimg[n] = "/l_sample,w_" + Math.round(width[n]) + ",h_" + Math.round(hight[n])
      dimention[n] = "/x_"+ Math.round(x[n]) + ",y_" + Math.round(y[n]) + ",g_north_west,"
      addborder[n] = "o_0,fl_layer_apply,bo_5px_solid_" + color[i] + "/";
      raw_transformation = raw_transformation + addtext[n] + addtextloc[n] + addimg[n] + dimention[n] + addborder[n]
      if(model == "cld-fashion" && value[n]['attributes']) {
        document.body.appendChild(document.createTextNode(key));
        document.body.appendChild(renderjson(value[n]['attributes']));
      }
    }
     i++;
    global_trans = global_trans + "/" + raw_transformation
  }

  console.log(cl.url(pid,{folder:demo_folder, raw_transformation:global_trans}))
  document.body.appendChild(cl.imageTag(pid,{raw_transformation:global_trans}).toDOM());
}

function checkModel() {
  if(document.getElementById('cld-fashion').checked == true) {
    model = "cld-fashion";
    preset = "cld-fashion";
  }
  else if(document.getElementById('human-anatomy').checked == true) {
    model = "human-anatomy";
    preset = "human-anatomy";
  }
  else if(document.getElementById('coco').checked == true) {
    model = "coco";
    preset = "ai-coco";
  }
  else if(document.getElementById('lvis').checked == true) {
    model = "lvis";
    preset = "ai-lvis"
  }
  else if(document.getElementById('openimages').checked == true) {
    model = "openimages";
    preset = "openimages";
  }
  else {
    model = "cld-fashion";
    preset = model;
  }
}
