const express = require('express')
const pool = require('../config')
const path = require("path")
const multer = require('multer')
const { json } = require("express");
const fs = require("fs");
let alert = require('alert');

const router = express.Router()



var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./static/uploads");
    },
    filename: function (req, file, callback) {
        callback(
            null,
            file.originalname.split(path.extname(file.originalname))[0] +
            "-" +
            Date.now() +
            path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage });



router.post('/detail/:carid', async function (req, res, next) {
    try {
        const [detailcar, field] = await pool.query(
            'SELECT * FROM Car AS c JOIN Seller AS s ON(c.seller_id = s.user_id) WHERE car_id = ?', [
            req.params.carid
        ]
        )
        const [carimg, field1] = await pool.query(
            'SELECT * FROM Car_images WHERE car_id = ?', [
            req.params.carid
        ]
        )
        res.json({
            detailcar: detailcar[0],
            carimg: carimg
        })
    } catch (error) {
        res.json(error)
    }
})
router.post('/getcar', async function (req, res, next) {
    try {
        const [cars, field] = await pool.query(
            'SELECT * FROM Car Join Car_images USING(car_id) WHERE main = 1'
        )
        // cars.forEach(car => {
        //     var thai = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB' }).format(car.car_price);
        //     car.push({bath : thai})
        // });
        return res.json(cars);
    } catch (err) {
        return res.status(500).json(err)
    }
})



router.post(
    "/addcar/:id",
    upload.array("carImage", 6),
    async function (req, res, next) {
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        console.log(req.files);
        try {
            const file = req.files;
            let pathArray = [];
            let car_model = req.body.car_model;
            let car_year = req.body.car_year;
            let car_color = req.body.car_color;
            let car_desc = req.body.car_desc;
            let car_price = req.body.car_price;
            let car_regis = req.body.car_regis;
            let car_distance = req.body.car_distance;
            let car_engine = req.body.car_engine;
            let car_gear = req.body.car_gear;
            let car_yearbought = req.body.car_yearbought;
            let car_owner = req.body.car_owner;
            let car_num_of_gear = req.body.car_num_of_gear;
            let car_type = req.body.car_type;
            let car_brand = req.body.car_brand;
            let car_drive_type = req.body.car_drive_type;
            let car_act = req.body.car_act;
            let car_num_of_door = req.body.car_num_of_door;
            console.log(
                car_year,
                car_color,
                car_desc,
                car_price,
                car_regis,
                car_distance,
                car_engine,
                car_gear,
                car_yearbought,
                car_owner,
                car_num_of_gear,
                car_brand,
                car_drive_type,
                car_act,
                car_num_of_door
            );
            const [car, field1] = await conn.query(
                "INSERT INTO Car(seller_id, car_model, car_modelyear, car_color, car_desc, car_price, car_regis, car_distance, car_engine, car_gear, car_yearbought, car_owner, car_num_of_gear, car_type, car_brand, car_drive_type, car_act, car_num_of_door) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    req.params.id,
                    car_model,
                    car_year,
                    car_color,
                    car_desc,
                    car_price,
                    car_regis,
                    car_distance,
                    car_engine,
                    car_gear,
                    car_yearbought,
                    car_owner,
                    car_num_of_gear,
                    car_type,
                    car_brand,
                    car_drive_type,
                    car_act,
                    car_num_of_door,
                ]
            );
            console.log(car.insertId);
            let checkmain = true;
            file.forEach((file, index) => {
                let path = [file.path.substring(6), car.insertId, checkmain];
                pathArray.push(path);
                if (checkmain == true) {
                    checkmain = false;
                }
            });
            // console.log(pathArray);
            const [img, field2] = await conn.query(
                "INSERT INTO Car_images(car_img, car_id, main) VALUES ?;",
                [pathArray]
            );
            await conn.commit();
            // console.log(img.insertId);
            return res.json("success");
        } catch (err) {
            await conn.rollback();
            next(err);
        }
    }
);








router.post(
    "/updatecar/:id",
    upload.array("carImage", 6),
    async function (req, res, next) {
        const conn = await pool.getConnection();
        await conn.beginTransaction();
        try {
            const file = req.files;
            let pathArray = [];
            let deleteimg = []
            let car_model = req.body.car_model;
            let car_year = req.body.car_year;
            let car_color = req.body.car_color;
            let car_desc = req.body.car_desc;
            let car_price = req.body.car_price;
            let car_regis = req.body.car_regis;
            let car_distance = req.body.car_distance;
            let car_engine = req.body.car_engine;
            let car_gear = req.body.car_gear;
            let car_yearbought = req.body.car_yearbought;
            let car_owner = req.body.car_owner;
            let car_num_of_gear = req.body.car_num_of_gear;
            let car_type = req.body.car_type;
            let car_brand = req.body.car_brand;
            let car_drive_type = req.body.car_drive_type;
            let car_act = req.body.car_act;
            let car_num_of_door = req.body.car_num_of_door;
            console.log(
                car_year,
                car_color,
                car_desc,
                car_price,
                car_regis,
                car_distance,
                car_engine,
                car_gear,
                car_yearbought,
                car_owner,
                car_num_of_gear,
                car_brand,
                car_drive_type,
                car_act,
                car_num_of_door
            );
            const [car, field1] = await conn.query(
                "UPDATE Car SET car_model = ?, car_modelyear = ?, car_color = ?, car_desc = ?, car_price = ?, car_regis = ?, car_distance = ?, car_engine = ?, car_gear = ?, car_yearbought = ?, car_owner = ?, car_num_of_gear = ?, car_type = ?, car_brand = ?, car_drive_type = ?, car_act = ?, car_num_of_door = ? WHERE car_id = ?",
                [
                    car_model,
                    car_year,
                    car_color,
                    car_desc,
                    car_price,
                    car_regis,
                    car_distance,
                    car_engine,
                    car_gear,
                    car_yearbought,
                    car_owner,
                    car_num_of_gear,
                    car_type,
                    car_brand,
                    car_drive_type,
                    car_act,
                    car_num_of_door,
                    req.params.id,
                ]
            );
            const [
                images,
                imageFields,
            ] = await conn.query(
                "SELECT car_img FROM Car_images WHERE car_id = ?",
                [req.params.id]
            );
            //   images.forEach(img => {
            //     //   console.log(img.car_img == req.body.carImage[0].substring(21))
            //       req.body.carImage.filter(val =>{
            //           if(val.substring(21) != img.car_img){
            //               deleteimg.push(img.car_img)
            //           }
            //         })
            //     //   if(req.body.carImage[0].substring(21).indexOf(img) < 0){
            //     //     deleteimg.push(img)
            //     //   }
            //   });
            //   console.log(deleteimg)
            //   // // Delete File from path
            const appDir = path.dirname(require.main.filename); // Get app root directory
            console.log(appDir)
            images.forEach(img => {
                const p = path.join(appDir, 'static', img.car_img);
                fs.unlinkSync(p);
            });

            const [
                delimages,
                _,
            ] = await conn.query(
                "DELETE FROM Car_images WHERE car_id = ?",
                [req.params.id]
            );

            let checkmain = true;
            file.forEach((file, index) => {
                let path = [file.path.substring(6), req.params.id, checkmain];
                pathArray.push(path);
                if (checkmain == true) {
                    checkmain = false
                }
            });
            console.log(pathArray)
            const [img, field2] = await conn.query(
                'INSERT INTO Car_images(car_img, car_id, main) VALUES ?;', [
                pathArray
            ]
            )
            await conn.commit();
            return res.json("success");
        } catch (err) {
            await conn.rollback();
            next(err);
        }
    }
);
module.exports = router