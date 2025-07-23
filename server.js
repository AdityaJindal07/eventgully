var express = require("express");
var app = express();
var port = 2400;
var fileuploader = require("express-fileupload");
var cloudinary = require("cloudinary").v2;

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDgCOT16G96aWj1_j1RCHsebE6ZaVyVHBc");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


var mysql2 = require("mysql2");

app.listen(port, function () {
    console.log("Server Started at Port no: 2400");
})


app.use(express.static("public"));

app.get("/", function (req, resp) {
    console.log(__dirname);
    console.log(__filename);

    let path = __dirname + "/index.html";
    resp.sendFile(path);
})

app.use(express.urlencoded(true));
app.use(express.json());
app.use(fileuploader());

cloudinary.config({
    cloud_name: 'dtpcwn5af',
    api_key: '379557573116143',
    api_secret: 'rvJQA1tA0bONwHs1CjY-yduE-8g' // Click 'View API Keys' above to copy your API secret
});


let dbConfig = "mysql://avnadmin:AVNS_bQ3CJKDJDEa2iFRFeDi@mysql-1917bd63-adityajindal704-0cd0.j.aivencloud.com:20741/defaultdb"

let mySqlVen = mysql2.createConnection(dbConfig);

mySqlVen.connect(function (errKuch) {
    if (errKuch == null)
        console.log("AiVen Connnected Successfully");
    else
        console.log(errKuch.message);
})

app.get("/server-signup", function (req, resp) {
    let txtEmail = req.query.id;
    let txtPwd = req.query.txtPwd;
    let comboUser = req.query.comboUser;
    let pass_validity = req.query.pass_validity;
    console.log(txtEmail);
    if (pass_validity == null) {
        mySqlVen.query("insert into users2025 values(?,?,?,1,current_date())", [txtEmail, txtPwd, comboUser], function (errKuch) {

            if (errKuch == null)
                resp.send(comboUser);
            else
                console.log(errKuch.message);
            })
        }

        
        else
        resp.send("password is weak");
    
    
    })



app.get("/do_login", function (req, resp) {
    let txtEmail2 = req.query.txtEmail2;
    let txtPwd2 = req.query.txtPwd2;

    console.log(txtEmail2);

    mySqlVen.query("select * from users2025 where txtEmail = ? and txtPwd = ? and status = ?", [txtEmail2, txtPwd2, 1], function (err, allRecords) {

        if (allRecords.length == 0) {
            resp.send("Invalid");
        }
        else if (allRecords[0].status == 1) {
            resp.send(allRecords[0].comboUser);
        }

        else {
            resp.send("Blocked");
        }


    })
})

app.post("/do_registration", async function (req, resp) {

    let picurl = "";
    if (req.files != null) {
        let fName = req.files.picupload.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.picupload.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {


            picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
        });
    }
    else
        picurl = "nopic.jpg";


    let emailid = req.body.emailid;
    let orgname = req.body.orgname;
    let regnumber = req.body.regnumber;
    let address = req.body.address;
    let sports = req.body.sports;
    let website = req.body.website;
    let insta = req.body.insta;
    let head = req.body.head;
    let contact = req.body.contact;

    console.log(emailid);

    mySqlVen.query(
        "insert into regorg(emailid, picurl, orgname, regnumber, address, sports, website, insta, head, contact, dos) values(?,?,?,?,?,?,?,?,?,?,current_date())",
        [emailid, picurl, orgname, regnumber, address, sports, website, insta, head, contact],
        function (errKuch) {
            if (errKuch == null)
                resp.send("recorded successfully");
            else
                resp.send(errKuch.message);
        }
    );


})

app.post("/update-user", async function (req, resp) {
    let picurl = "";
    if (req.files != null) //user wants to Update Profile Pic
    {
        let fName = req.files.picupload.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.picupload.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
        });
    }
    else
        picurl = req.body.hdn;


    let emailid = req.body.emailid;
    let orgname = req.body.orgname;
    let regnumber = req.body.regnumber;
    let address = req.body.address;
    let sports = req.body.sports;
    let website = req.body.website;
    let insta = req.body.insta;
    let head = req.body.head;
    let contact = req.body.contact;


    mySqlVen.query("update regorg set orgname=? ,picurl=?,regnumber=?, address=?,sports=?,website=?,insta=?,head=?,contact=? where emailid=?", [orgname, picurl, regnumber, address, sports, website, insta, head, contact, emailid], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send("updated Successfulllyyy");
            else
                resp.send("Inavlid email Id");
        }
        else
            resp.send(errKuch.message)
    })

})

app.get("/get-one", function (req, resp) {
    let emailid = req.query.emailid;
    mySqlVen.query("select * from regorg where emailid=?", [emailid], function (err, allRecords) {
        if (allRecords.length == 0)
            resp.send("No Record Found");
        else
            resp.json(allRecords);
    })
})

app.post("/Post_event", function (req, resp) {

    let emailid = req.body.emailid;
    let eventname = req.body.eventname;
    let doe = req.body.date;
    let Address = req.body.Address;
    let toe = req.body.time;
    let inputState = req.body.inputState;
    let Category = req.body.Category;
    let minage = req.body.minage;
    let contact = req.body.contact;
    let maxage = req.body.maxage;
    let lastDate = req.body.lastDate;
    let fee = req.body.fee;
    let pMny = req.body.pMny;
    let otherinfo = req.body.otherinfo;

    mySqlVen.query("insert into post_event values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [null, emailid, eventname, doe, Address, toe, inputState, Category, minage, contact, maxage, lastDate, fee, pMny, otherinfo], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send("published Successfulllyyy");
            else
                resp.send("Inavlid email Id");
        }
        else
            resp.send(errKuch.message);
    })



})

app.get("/do-fetch-all-users", function (req, resp) {
    let emailid = req.query.data;

    mySqlVen.query("select * from post_event where emailid = ?", [emailid], function (err, allRecords) {
        resp.json(allRecords);
    })
})


app.get("/do-fetch-all-events", function (req, resp) {


    mySqlVen.query("select * from post_event", function (err, allRecords) {
        resp.json(allRecords);
    })
})

app.get("/do-fetch-all", function (req, resp) {


    mySqlVen.query("select * from users2025", function (err, allRecords) {
        resp.json(allRecords);
    })
})

app.get("/do-fetch-all-players", function (req, resp) {

    mySqlVen.query("select * from player_details", function (er, allRecords) {
        resp.json(allRecords)
    })
})

app.get("/do-fetch-all-organisers", function (req, resp) {

    mySqlVen.query("select * from regorg", function (err, allRecords) {
        resp.json(allRecords)
    })
})

app.get("/do-fetch-all-states", function (req, resp) {
    mySqlVen.query("select distinct inputState from post_event", function (err, allRecords) {
        resp.send(allRecords);
    })
})

app.get("/do-fetch-all-tournaments", function (req, resp) {


    mySqlVen.query("select * from post_event where inputState = ? and Category=?", [req.query.kuchState, req.query.kuchGame], function (err, allRecords) {
        resp.send(allRecords);
    })
})


app.get("/delete-one", function (req, resp) {
    console.log(req.query)
    let rid = req.query.rid;

    mySqlVen.query("delete from post_event where rid=?", [rid], function (errkuch, result) {
        if (errkuch == null) {
            if (result.affectedRows == 1) {
                resp.send("Deleted Successfully");
            }
            else {
                resp.send("invalid")
            }
        }
        else
            resp.send(errkuch);
    })
})

async function RajeshBansalKaChirag(imgurl) {
    const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: ''}. Dont give output as string."
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())

    const cleaned = result.response.text().replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleaned);
    console.log(jsonData);

    return jsonData

}

app.post("/do_player-details", async function (req, resp) {

    let picurl2 = "";
    if (req.files != null) {
        let fName = req.files.pic_upload.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.pic_upload.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {


            picurl2 = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl2);
        });
    }
    else
        picurl2 = "nopic.jpg";




    let picurl1 = "";
    if (req.files != null) {


        let fName = req.files.adhaarupload.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.adhaarupload.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(async function (picUrlResult) {


            picurl1 = picUrlResult.url;

            let jsonData = await RajeshBansalKaChirag(picUrlResult.url);//will give u the url of ur pic on cloudinary server
            // resp.send(jsonData);
            var gender = jsonData.gender;
            var dob = jsonData.dob;
            var name = jsonData.name;
            var adhaar_number = jsonData.adhaar_number;

            // mySqlVen.query(
            //     "insert into player_details2(name, adhaar_number, gender,dob2) values(?,?,?,?)",
            //     [name, adhaar_number, gender,dob2],
            //     function (errKuch) {
            //        if(errKuch!=null){
            //         resp.send(errKuch.message);
            //        }
            //     }
            // );
            console.log(picurl1);

            let emailid = req.body.emailid;
            let plyname = req.body.plyname;
            let games = req.body.games;
            let address = req.body.address;
            let otherinfo = req.body.otherinfo;
            let contact = req.body.contact;

            console.log(emailid);



            mySqlVen.query(
                "insert into player_details(name, adhaar_number, gender,dob,emailid, picurl1,picurl2, plyname, games, address, otherinfo, contact) values(?,?,?,?,?,?,?,?,?,?,?,?)",
                [name, adhaar_number, gender, dob, emailid, picurl1, picurl2, plyname, games, address, otherinfo, contact],
                function (errKuch) {
                    if (errKuch == null)
                        resp.send("recorded successfully");
                    else
                        resp.send(errKuch.message);
                }
            );
        });
    }
    else
        picurl1 = "nopic.jpg";
})

app.get("/block-one", function (req, resp) {
    let txtEmail = req.query.txtEmail;
    let status = req.query.status;

    if (status == 1) {
        mySqlVen.query("update users2025 set status = 0 where txtEmail = ?", [txtEmail], function (errKuch) {
            if (errKuch == null) {
                resp.send("good");
            }
        })
    }

})

app.get("/unblock-one", function (req, resp) {
    let txtEmail = req.query.txtEmail;
    let status = req.query.status;

    if (status == 0) {
        mySqlVen.query("update users2025 set status = 1 where txtEmail = ?", [txtEmail], function (errKuch) {
            if (errKuch == null) {
                resp.send("good");
            }
        })
    }

})

app.get("/update-pwd", function (req, resp) {
    mySqlVen.query("update users2025 set txtPwd = ? where txtEmail=?", [req.query.txtPwdnew, req.query.txtEmail], function (err) {
        if (err == null) {
            resp.send("good");
        }
    })
})

app.get("/chk-old-pwd", function (req, resp) {
    let txtEmail = req.query.txtEmail;

    mySqlVen.query("select txtPwd from users2025 where txtEmail = ?", [txtEmail], function (err, result) {
        if (err == null) {
            resp.send(result[0].txtPwd);
        }
    })
})
