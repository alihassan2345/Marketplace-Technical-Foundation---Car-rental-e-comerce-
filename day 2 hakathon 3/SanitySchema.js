export default {
    name:'blog',
    title:'Blog',
    type:'document',
    fields:[
        {name:'heading',title:'Title',type:'string',},
        {name:'description',title:'Description', type:'string', },            
         {  name:'slug', title:'Slug',type:'slug',options:{
                source:'heading',
                maxLength:96
            }},
        { name:'image',  title:'Image', type:'image', options:{
       hotspot:true}  },
         { name:'fuel', title:'Fuel',type:'string',},            
           { name : 'cartype',title: 'Cartype',type:'string', },   
           {  name : 'transmission', title: 'Transmission', type:'string', },
        {  name : 'capacity', title: 'Capacity', type:'string', },       
            ],}

           