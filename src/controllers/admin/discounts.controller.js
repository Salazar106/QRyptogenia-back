import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

/*
 * @Author : Nicolas Barrios,   @date 2024-08-10 21:33:32
 * @description : se agregaron controladores del crud de la tabla discounts
 * @Params : todas las funciones tienen los parametros req (request) y res(response)
 * @return : todas las funciones retornan las consultas a la base de datos
*/

export const CreateDiscount=async(req,res)=>{
    const {discount,description,limit_date,use_quantity,quantity_current_use}=req.body;
    try{
        const query=await prisma.discount.create({
            data:{
                discount:  discount,
                description: description,
                limit_date:new Date(limit_date).toISOString(),
                use_quantity: parseInt(use_quantity),
            }
        })
        return res.status(200).json(query);
    }catch(error){
        console.error("error request: ",error);
        res.status(500).json({message: error.message});
    }
}

export const GetDiscounts=async(req,res)=>{
    try{
        const query= await prisma.discount.findMany();
        res.status(200).json(query);
    }catch(error){
        console.error("error request: ",error);
        res.status(500).json({message: error.message});
    }
}

export const getOneDiscount=async(req,res)=>{
    const {id}=req.params;
    try{
        const query=await prisma.discount.findUnique({
            where:{
                id:id,
            }
        });
        res.status(200).json(query);
    }catch(error){
        console.error("error request: ",error);
        res.status(500).json({message:error.message});
    }
}

export const updateDiscount = async (req, res) => {
    const { id } = req.params;
    const discount = req.body;

    try {
        const query = await prisma.discount.update({
            where: {
                id: id,
            },
            data: {
                discount: discount.discount,
                description: discount.description,
                use_quantity: parseInt(discount.use_quantity),
                limit_date: new Date(discount.limit_date).toISOString(),
                update_date: new Date().toISOString(),
            }
        });
        res.status(200).json({ message: "Register was updated successfully"});
        return query;
    } catch (error) {
        console.error("Error request: ", error);
        res.status(500).json({ message: error.message });
    }
};

export const changeState=async(req,res)=>{
    const {id}=req.params;
    const discount=req.body;
    try{
        const validateDiscount=await prisma.discountMembership.findMany({
            where:{
                discountId:id,
            }
        })

        if(validateDiscount.length>0){
            console.warn("you cannot change state because it is asociated with an active membership");
            res.status(400).json({message: "you cannot change state because it is asociated with an active membership"})
        }else{
            const query=await prisma.discount.update({
                where:{
                    id:id,
                },
                data:{
                    state:discount.state,
                }
            })
            res.status(200).json({message:"state discount was changed sucessfully"});
            return query;
        }
    }catch(error){
        console.error("error request: ",error);
        res.status(500).json({message:error.message});
    }
}

export const deleteDiscount = async (req, res) => {
    const { id } = req.params;
    try {
        const validate = await prisma.discountMembership.findMany({
            where: {
                discountId: id
            }
        });

        if (validate.length>0) {
            console.warn("Invalid request, the register cannot be associated with a membership.");
            res.status(400).json({ message: "The discount is associated with a membership and cannot be deleted." });
        } else {
            await prisma.discount.delete({
                where: {
                    id: id
                }
            });
            res.status(200).json({ message: "Register was deleted successfully." });
        }
    } catch (error) {
        console.error("Error request: ", error);
        res.status(500).json({ message: error.message });
    }
};
