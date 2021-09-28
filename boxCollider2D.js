class boxCollider{


    constructor(worldx=0,worldy=0,width=1,height=1,rotation=0,colour="rgba(230,230,230,1)", areachecksize = 40 + Math.sqrt(Math.pow(width/2,2)+ Math.pow(height/2,2))){
        this.worldx = worldx,
        this.worldy = worldy,
        this.width = width,
        this.height = height,
        this.colour = colour,
        this.worldAngle = rotation*Math.PI/2;
        this.angle1 = Math.atan((height/2)/(width/2)),
        this.angle2 = Math.atan((width/2)/(height/2)) + (Math.PI/2),
        this.angle3 = Math.atan((height/2)/(width/2)) + Math.PI,
        this.angle4 = Math.atan((-width/2)/(-height/2)) + (Math.PI/2*3);
        this.points = [[0,0],[0,0],[0,0],[0,0]];
        this.areachecksize = areachecksize;
    }
    setAngle(){
        while(this.worldAngle > Math.PI*2){
            this.worldAngle -= Math.PI*2;
        }
        while(this.worldAngle <= 0){
            this.worldAngle += Math.PI*2;
        }
        let allpoints = [];
        for(let i = 1; i <= 4;i++){
            let pos = rotate(this.worldx,this.worldy,this.width,this.height,eval("this.angle" + i) + this.worldAngle)
            allpoints.push(pos);
        }
        this.points = allpoints;
    }

    draw(){
        drawSquare(X(this.points[0][0]),Y(this.points[0][1]),X(this.points[1][0]),Y(this.points[1][1]),X(this.points[2][0]),Y(this.points[2][1]),X(this.points[3][0]),Y(this.points[3][1]),this.colour);
    }











}//class end

