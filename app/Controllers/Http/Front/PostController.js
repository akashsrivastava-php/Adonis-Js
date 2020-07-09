'use strict'
const Post = use('App/Models/Post')
const Comment = use('App/Models/Comment')
const Exam = use('App/Models/Examtype')
const Helpers = use('Helpers')
const { validate } = use('Validator')
const View = use('View')
const postPerPage = 10

View.global('formatDate', function (dateTime) {
  const compDate = new Date(dateTime)
  const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var hours = compDate.getHours();
    var minutes = ("0" + compDate.getMinutes()).slice(-2)
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const diff = today.getTime() - compDate.getTime();
    if (compDate.getDate() == today.getDate() && compDate.getMonth() == today.getMonth() && compDate.getFullYear() == today.getFullYear()) {
      return "Today " + hours + ":" + minutes + " " + ampm;
    } else if (diff <= (24 * 60 * 60 *1000)) {
      return "Yesterday " +  + hours + ":" + minutes + " " + ampm;
    } else { 
        return compDate.toDateString();
    }
})

class PostController {

  async index({view, auth, response}){
    if(auth.user.exams){
      const postList = await Post.query().with('user').with('comments', (builder)=>builder.with('user')).where('user_id', auth.user.id).whereIn('exam_id', auth.user.exams.split(',')).paginate(1,postPerPage)
      //return response.send(postList.toJSON())
      return view.render('front/posts', {postList: postList.toJSON()})
    }else{
      return response.redirect('/settings')
    }
  }

  async insert({auth, request, response, session}){
    const { post, exam } = request.all()
    const img = request.file('image', {
        types: ['image'],
        size: '2mb'
    })

    let imgName

    if(img){
        imgName = `${auth.user.id}_${Date.now()}.${img.extname}`
        await img.move(Helpers.publicPath('posts'), {
            name: imgName,
            overwrite: true
        })
    }

    const rules = {
        post: 'required'
    }
  
    const validation = await validate(request.all(), rules)

    if(validation.fails()){
        session.withErrors(validation.messages())
        return response.redirect('back')
      }else{
        try{
            const postData = new Post()
            postData.post_text = post
            postData.user_id = auth.user.id
            postData.exam_id = exam
            if(imgName){
              postData.post_image = `/posts/${imgName}`
            }
            await postData.save()
            return response.redirect('/posts')
        }
        catch(e){
          session.withErrors({ notification: 'Something went wrong!' })
          return response.redirect('back')
        }
      }

  }

  async insertComment({request, auth, params, session, response}){
    const { comment } = request.all()
    const { id } = params

    const rules = {
      comment: 'required'
    }

    const validation = await validate(request.all(), rules)

    if(validation.fails()){
      session.withErrors(validation.messages())
      return response.status(400).send({msg: 'Please write a comment!'})
    }else{
      const data = new Comment()
      data.comment = comment
      data.user_id = auth.user.id,
      data.post_id = id
      await data.save()
      return response.status(200).send({msg: comment})
    }
  }

  async likePost({response, auth, params}){
    const { id } = params
    const post = await Post.find(id)
    const likes = post.post_like
    let finalLikes, className, likeCount
    if(likes){
      if(likes.search(',') != -1){
        const arr = likes.split(',')
        const index = arr.indexOf(String(auth.user.id))
        if(index != -1){
          arr.splice(index, 1)
          className = 'btn-secondry'
        }else{
          arr.push(auth.user.id)
          className = 'btn-primary'
        }
        likeCount = arr.length
        finalLikes = arr.join(',')
      }else{
        if(likes == auth.user.id){
          finalLikes = ''
          likeCount = 0
          className = 'btn-secondry'
        }else{
          finalLikes = likes+','+auth.user.id
          className = 'btn-primary'
          likeCount = 2
        }
      }
    }else{
      finalLikes = auth.user.id
      className = 'btn-primary'
      likeCount = 1
    }

    post.post_like = finalLikes
    await post.save()
    return response.status(200).send({msg: likeCount, className})
  }

  async postPagination({params, response, auth}){
    const { page } = params
    const postData = await Post.query().with('user').with('comments', (builder)=>builder.with('user')).where('user_id', auth.user.id).whereIn('exam_id', auth.user.exams.split(',')).paginate(page,postPerPage)
    let content = ''
    postData.toJSON().data.forEach(post => {
      
      content += '<div class="col-md-12 ml-auto col-lg-7 mr-auto"><div class="card"><div class="card-body"><div class="tab-content text-center"><div class="media post-head"><div class="media-body overflow-hidden"><div class="d-flex align-items-center mb-1"><h6 data-letters="'+post.user.username.charAt(0)+'" class="text-truncate mb-0 mr-auto">'+post.user.username+'</h6><p class="small text-muted text-nowrap ml-4">'+this.dateFormat(post.created_at)+'</p></div></div></div><div class="tab-pane active"><p class="text-left">'+post.post_text+'</p>'
      
      if(post.post_image){
        content += '<img src="'+post.post_image+'"></img>'
      }

      let likeCss = 'secondary'
      let likes = 0
      if(post.post_like){
        if((post.post_like).search(",") != -1){
          likes = post.post_like.split(",").length
          if(post.post_like.split(",").indexOf(auth.user.id) != -1){
            likeCss = 'primary'
          }else{
            likeCss = 'secondary'
          }
        }else if(post.post_like == auth.user.id){
          likeCss = 'primary'
          likes = 1
        }else{
          likeCss = 'secondary'
        }
      }
      
      content += '</div><div class="form-inline comment"><div class="col-6 col-lg-6 form-group"> <button id="likeBtn_'+post.id+'" data-id="'+post.id+'" class="likebtn btn btn-'+ likeCss +' btn-icon btn-round w-25" type="button"> <i class="now-ui-icons ui-2_like"></i> </button> <label for="likeBtn_'+post.id+'" class="font-weight-bold ml-2"> <span id="like_'+post.id+'">'+ likes +'</span></label></div><div class="col-6 col-lg-6 form-group"> <button id="commentBtn" data-id="'+post.id+'" class="btn btn-primary btn-icon btn-round w-25 commentbtn" type="button"> <i class="now-ui-icons ui-2_chat-round"></i> </button> <label for="commentBtn" data-id="'+post.id+'" class="font-weight-bold ml-2">'+ post.comments.length +'</label></div></div><div id="postcomment_'+post.id+'" class="form-inline comment postcomment"><div class="col-10 col-lg-10 form-group"><textarea rows="2" name="comment" class="form-control w-100" id="comment_{{post.id}}" placeholder="Enter Comments..."></textarea></div><div class="col-2 col-lg-2 form-group"> <button class="btn btn-primary btn-icon btn-round w-100 submitPost" id="'+post.id+'" type="submit"> <i class="now-ui-icons ui-1_send"></i> </button></div><div class="comment-container"><div class="comment-box"><div id="commentBlock_'+post.id+'" class="card-body">'
      
      if(post.comments.length > 0){
        post.comments.forEach((comment)=>{
          content += '<div class="media"><div class="media-body overflow-hidden"><div class="d-flex align-items-center mb-1"><h6 data-letters="'+comment.user.username.charAt(0)+'" class="text-truncate mb-0 mr-auto">'+comment.user.username+'</h6><p class="small text-muted text-nowrap ml-4">'+this.dateFormat(comment.created_at )+'</p></div><div class="text-left comment-line"><p>'+comment.comment+'</p></div></div></div><hr>'
        })
      }
      
      content += '</div></div></div></div></div></div></div></div>'

    });
    return response.status(200).send({post: postData, content})
  }

  async getCourseList({ response }){
    const allcourse = await Exam.query().with('exams').fetch()
    return response.status(200).send({course: allcourse.toJSON()})
  }

  dateFormat(dateTime){
    const compDate = new Date(dateTime)
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var hours = compDate.getHours();
    var minutes = ("0" + compDate.getMinutes()).slice(-2)
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const diff = today.getTime() - compDate.getTime();
    if (compDate.getDate() == today.getDate() && compDate.getMonth() == today.getMonth() && compDate.getFullYear() == today.getFullYear()) {
      return "Today " + hours + ":" + minutes + " " + ampm;
    } else if (diff <= (24 * 60 * 60 *1000)) {
      return "Yesterday " +  + hours + ":" + minutes + " " + ampm;
    } else { 
        return compDate.toDateString();
    }
  }

}

module.exports = PostController
