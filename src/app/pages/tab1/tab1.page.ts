import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';

//mis imports
import { NewsService } from 'src/app/services/news.service';




@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  
  
  @ViewChild(IonInfiniteScroll, {static: true}) InfiniteScroll!: IonInfiniteScroll; 


  //hacer publico el articulo para usar en el html
  public articles: Article[] = []; 



  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.getTopHeadlines()
              //insertar una arreglo en JS
    .subscribe(articles => this.articles.push(...articles)); 
  }


  loadData(){
    this.newsService.getTopHeadlinesByCategory('business', true)
    .subscribe(articles => {

      if ( articles.length === this.articles.length){

        this.InfiniteScroll.disabled = true; 
        return; 
      }


      this.articles = articles; 
      this.InfiniteScroll.complete(); 
    })

  }






}

