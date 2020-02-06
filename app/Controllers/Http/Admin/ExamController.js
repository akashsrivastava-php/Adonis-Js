'use strict'

const Exam = use('App/Models/Examtype')
const { validate } = use('Validator')

class ExamController {

  async listExamTypes({view, params, request}){
    const query = request.get()
   const page = params.page ? params.page : 1
   const data = await Exam
   .query()
   .where(function () {
     if(query.search){
      this
      .where(query.search, 'LIKE', '%'+query.keyword+'%')
     }
  }).paginate(page,10)
    return view.render('admin/examType/list', {data: data.toJSON()})
  }

  async addExamTypeForm({view, response}){
    return view.render('admin/examType/add')
  }

  async addExamType({request, response, session}){
    const { name } = request.all()
    const rules = {
      name: 'required'
    }
    const validation = await validate(request.all(), rules)
    if(validation.fails()){
      session.withErrors(validation.messages())
      return response.redirect('back')
    }else{
      const exam = new Exam()
      exam.name = name
      await exam.save()
      return response.redirect('/admin/list-examtypes')
    }
  }

  async editExamType({params,view}){
    const exam = await Exam.find(params.id)
    return view.render('admin/examType/edit', {exam: exam.toJSON()})
  }

  async updateExamType({params,response,session,request}){
    const { name } = request.all()
    const rules = {
      name: 'required'
    }
    const validation = await validate(request.all(), rules)
    if(validation.fails()){
      session.withErrors(validation.messages())
      return response.redirect('back')
    }else{
      const id = params.id
      const exam = await Exam.find(id)
      exam.name = name
      await exam.save()
      return response.redirect('/admin/list-examtypes')
    }
  }

  async deleteExamType({response, params}){
    const { id } = params
    const exam = await Exam.find(id)
    await exam.delete()
    return response.redirect('/admin/list-examtypes')
  }

}

module.exports = ExamController
