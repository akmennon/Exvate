const Work = require('../Models/work/work')

/* Function to create a new Work */

module.exports.create = (req,res) =>{
    const body = req.body
    
    Work.createNew(body)
        .then(function(work){
            res.json(work)
        })
        .catch(function(err){
            console.log(err)
        })
}

/* Function to show all works */

module.exports.all = (req,res) =>{
    const query = req.query

    Work.all(query,res,req.user)
        .then((works)=>{
            if(works.count){
                res.setHeader('full',works.count)
            }
            res.json(works.works)
        })
        .catch((err)=>{
            res.json(err)
        })
}

/* Function to display the entire details of a work */

module.exports.detail = (req,res) =>{
    const id = req.params.id
    Work.findById(id).populate('options').populate({path:'category',select:'title'}).populate({path:'type',select:'title'}).populate('result')
        .then(function(work){
            console.log(work.options.options)
            res.json(work)
        })
        .catch(function(err){
            res.json(err)
        })
}

module.exports.searchAll = (req,res) =>{

    Work.find({},'_id options title')
        .then((works)=>{
            res.json(works)
        })
        .catch((err)=>{
            console.log(err)
            res.json('Error fetching result')
        })
}

module.exports.workEdit = (req,res) =>{

    Work.workEdit(req.body)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            res.json(err)
        })
}