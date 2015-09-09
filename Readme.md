### Source/Reference & Observable store

#### Observed properties

when creating a reference:
 
     
         block.addReference(reference,{
             properties: {
                 "name":true,
                 "enabled":true
             },
             onDelete:true
         },true);