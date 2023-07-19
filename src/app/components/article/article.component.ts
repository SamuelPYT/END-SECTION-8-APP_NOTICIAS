import { Component, Input } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { ActionSheetController, ActionSheetButton, Platform } from '@ionic/angular';

//plugins
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article!: Article;
  @Input() index!: number;


  constructor(private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private SocialSharing: SocialSharing,
    private StorageService: StorageService) { }



  openArticle() {

    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();
    }

    window.open(this.article.url);

  }


  async onOpenMenu() {

    const articlesInFavorite = this.StorageService.articleInFavorites(this.article); 


    const normalBts: ActionSheetButton[] = [
      {
        text: articlesInFavorite ? 'Remover de mis favoritos': 'Favorito',
        icon: articlesInFavorite ? 'heart': 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
        cssClass: 'cancel-button'
      }
    ]


    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    }



    if (this.platform.is('capacitor')) {
      normalBts.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBts
    })

    await actionSheet.present();




  }


  onShareArticle() {
    const { title, source, url } = this.article;


    console.log('share article');
    this.SocialSharing.share(
      title,
      source.name,
      undefined,
      url
    )

  }


  onToggleFavorite() {
    this.StorageService.saveRemoveArticle(this.article); 

  }



}
