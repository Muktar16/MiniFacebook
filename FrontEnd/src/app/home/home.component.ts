import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { __await } from 'tslib';
import { PostService } from '../post.service';
import { StoryService } from '../story.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  serverErrorMessages: string = 'false';
  // storyImageBaseUrl = "http://localhost:9000/photos/";
  storyImageBaseUrl = "http://localhost:80/story/photos/";
  allPosts:any;
  createStoryClicked = 0;
  imageFile: File | null = null;
  allStories:any;
  currentUser = {
    userName:'',
    email:''
  }
  postDetails ={
    text:''
  };

  constructor(private userService: UserService, private router: Router, 
    private postService: PostService, private storyService:StoryService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  //getCurrentUserProfile
  getCurrentUser(){
    this.userService.getUserProfile().subscribe(
      (res:any) => {
        this.currentUser.userName = res['user'].userName;
        this.currentUser.email = res['user'].email;
        //get all stories and status
        this.getPosts();
        this.getStories();
      },
      err => { 
        this.serverErrorMessages = err.error.message;
      }
    );
  }

  //get all posts
  getPosts(){
    this.postService.getPosts().subscribe(
      (res:any) => {
        this.allPosts = res;
      },
      err => {
        this.serverErrorMessages = err.error.message;
      }
    );
  }

  
  //get all stories
  getStories(){
    this.storyService.getStories().subscribe(
      (res:any) =>{
        this.allStories = res;
        //change story url 
        this.allStories.forEach((story:any) => {
          story.storyUUID = this.storyImageBaseUrl+story.storyUUID;
        });
    },
    err => {
      this.serverErrorMessages = err.error.message;
    }
    );
  }

  UploadPost(){
    this.postService.savePost(this.postDetails).subscribe(
      (res:any) => {
        alert("Post Uploaded Successfuly!!!");
        this.getPosts();
        this.router.navigate(['/login']);
      },
      err => {
        this.serverErrorMessages = err.error.message;
      }
    )
  }

  changeStoryClicked(){
    this.createStoryClicked = 1;
  }


  saveStory(event: any) {
    this.createStoryClicked = 0;
    this.imageFile = event.target.files[0];
    if (this.imageFile) {
      var imageDetails = new FormData();
      imageDetails.append('files', this.imageFile, this.imageFile.name);

      this.storyService.saveStory(imageDetails).subscribe(
        (res:any) => {
        if(res) { alert("Story Posted Successfully");this.getStories();}
      },err=>{
        this.serverErrorMessages = err.error.message;
      })
    }
  
  }

  Logout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

}
