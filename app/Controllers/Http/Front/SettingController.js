'use strict'
const Hash = use('Hash')
const User = use('App/Models/User')
const Exam = use('App/Models/Examtype')
const { validate } = use('Validator')

class SettingController {

  async getAllSetting({view, response, auth}){
    const allcourse = await Exam.query().with('exams').fetch()
    return view.render('front/setting', {courses: allcourse.toJSON()})
  }

  async updateExam({request, response, auth}){
    const { exams } = request.all()
    const user = await User.find(auth.user.id)
    if(exams && exams.length > 0){
        if(exams.length > 1){
            user.exams = exams.join()
        }else{
            user.exams = exams
        }
    }else{
        user.exams = ""
    }
    await user.save()
    return response.redirect('/posts')
  }

  async changePass({ request, response, auth, session }){
    const { currentpass, password, cpassword } = request.all()

    const rules = {
      currentpass: 'required',
      password: 'required',
      cpassword: 'required|same:password',
    }

    const validation = await validate(request.all(), rules)

    if(validation.fails()){
      session.flash({error: validation.messages()[0].message})
      return response.redirect('back')
    }else{
      const isSame = await Hash.verify(currentpass, auth.user.password)
      if(isSame){
        const user = await User.find(auth.user.id)
        user.password = password
        await user.save()
        session.flash({ success: 'Your password updated successfully' })
      }else{
        session.flash({ error: 'Current password is not matching!' })
      }
      return response.redirect('back')
    }
  }
}

module.exports = SettingController
