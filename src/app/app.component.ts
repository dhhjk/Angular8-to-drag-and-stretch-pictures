import { Component, OnInit } from '@angular/core';
import { AngularResizableDirective } from 'angular2-draggable';
import { ElementRef} from '@angular/core';
import { AppService } from './app.service';
import { List } from './list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private el: ElementRef,private AppService: AppService) { }

  inBounds = true;   // 边界控制 true为是
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  imageLimit = {  // 控制调整大小界限
    rzMinWidth: '10',
    rzMaxWidth: '100',
    rzMinHeight: '10',
    rzMaxHeight: '100'
  }
  state = '';    // 调整大小状态
  size: any = null;  // 调整大小
  position: any = null; // 在左边调整大小时坐标偏移量
  item_position = [{
    x: 0,
    y: 0
  }];
  ob;

  movingOffset = { x: 0, y: 0 }; // 移动的时候左上角坐标
  endOffset = { x: 0, y: 0 }; // 移动后松开鼠标左上角的坐标

  list: List[];
  drag_id;
  drag_flag: Array<boolean> = [false]; // 调整大小和拖拽实现

  onStart(event) {
    // console.log('开始移动:', event);
  }

  onStop(event) {
    // console.log('停止移动:', event);
  }

  onMoving(event) {
    this.movingOffset.x = event.x;
    this.movingOffset.y = event.y;
  }

  onMoveEnd(event) {
      this.endOffset.x = event.x;
      this.endOffset.y = event.y;
      this.getImgInfo(1);
  }

  checkEdge(event) {
    this.edge = event;
    // console.log('edge:', event);
  }


  onResizeStart(event) {
    this.state = '调整大小开始';
    this.size = event.size;
    this.position = event.position;
  }

  onResizing(event) {
    this.state = '调整大小中';
    this.size = event.size;
    this.position = event.position;
  }

  onResizeStop(event) {
    this.state = '调整大小结束';
    this.size = event.size;
    this.position = event.position;
    this.getImgInfo(2);
  }

  onReset(block: AngularResizableDirective) {
    block.resetSize();
    let { size, position } = block.getStatus();
    this.size = size;
    this.position = position;
    this.getImgInfo(2);
  }

  getImgInfo(op) {
    for(let i in this.list) {
      if(this.size === null) {
        if(this.list[i].id === this.drag_id) {  
          this.list[i].x = this.endOffset.x; // 鼠标松开的横坐标
          this.list[i].y = this.endOffset.y; // 鼠标松开的纵坐标
          console.log("id x y w h 1",this.list[i]);
        } 
      } else{
        console.log(this.drag_id);
        if(this.list[i].id === this.drag_id) {
          if(op === 2) {  //调整大小
            this.list[i].w = this.size.width;   // 调整大小后的大小
            this.list[i].h = this.size.height;
            this.list[i].l = this.position.left;
            this.list[i].t = this.position.top;
          } else{            //移动
            this.list[i].x = this.endOffset.x; // 鼠标松开的横坐标
            this.list[i].y = this.endOffset.y; // 鼠标松开的纵坐标
            // this.list[i].w = this.size.width;   // 调整大小后的大小
            // this.list[i].h = this.size.height;
          }
          console.log("id x y w h 1",this.list[i]);
        }
      }
    }
  }
  storageObj(obj) {                           // localstorage 存储
    var checkedIdStr = JSON.stringify(obj);             // json.stringify可以将对象转换为 JSON 字符串
    localStorage.setItem("key", checkedIdStr);
  }
  holdPosition() {
    // this.getImgInfo();
    console.log(this.list);
    // this.item_position = this.list;
    this.storageObj(this.list);
    var arrAfter = JSON.parse(localStorage.getItem("key"));
    console.log(arrAfter,typeof arrAfter);
  }
  setPosition() {               // 加载时显示位置大小
    for(let i in this.list) {
      const div = this.el.nativeElement.querySelector(`.drag_block_${i}`);
      div.style.height = `${this.list[i].h}px`;
      div.style.width = `${this.list[i].w}px`;
      div.style.left = `${this.list[i].l}px`;
      div.style.top = `${this.list[i].t}px`;
      this.item_position[i] = {x: this.list[i].x, y: this.list[i].y};
      this.drag_flag[i] = false;
      console.log(this.list);
    }
  }
  
  dragFlag(e) {                // 图片点击判定及边框
    console.log(e.target.id );
    // if(e.target.id === 'img1') {
      //   this.drag_flag[0] = true;
      //   this.drag_flag[1] = false;
      //   this.drag_id = 1;
      //   document.getElementById("img1").className="img_active";
    //   document.getElementById("img2").className="img_link";
    // } else if(e.target.id === 'img2') {
      //   this.drag_flag[0]= false;
      //   this.drag_flag[1] = true;
      //   this.drag_id = 2;
      //   document.getElementById("img1").className="img_link";
      //   document.getElementById("img2").className="img_active";
      // } else {
        //   this.drag_flag[0] = false;
        //   this.drag_flag[1] = false;
        //   document.getElementById("img1").className="img_link";
        //   document.getElementById("img2").className="img_link";
        // }
        for(let i in this.list) {
          if(e.target.id === `img${i}`) {
            this.drag_flag[i] = true;
            this.drag_id = this.list[i].id;
            document.getElementById(`img${i}`).className="img_active";
      } else {
        this.drag_flag[i] = false;
        document.getElementById(`img${i}`).className="img_link";
      }
    } 
  }
  
  getService() {
    this.AppService.getConfig().subscribe(data => {
      this.ob = data;
      this.list = this.ob;
    })
    console.log(this.list);
  }

  ngOnInit() {
    // this.AppService.getConfig()
    // .subscribe((data) =>{ this.list = data;
    // });
    // console.log(this.list)

    // this.getService();
    let arrAfter = JSON.parse(localStorage.getItem("key"));
    this.list = arrAfter;
    console.log(this.list);
    setTimeout(() => {
      this.setPosition();
    }, 1000);
  }
}
