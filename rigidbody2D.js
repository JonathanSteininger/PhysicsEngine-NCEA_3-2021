class rigidBody{


    constructor (worldx = 0,worldy = 0,width = 1,height = 1,xSpeed = 0,ySpeed = 0,rotSpeed = 0,friction = 1, EkCM = 0.5, colour = "rgba(255,0,0,1)",mass = width*height,angle = 0,bounciness = 1, areachecksize = 40 + Math.sqrt(Math.pow(width/2,2)+ Math.pow(height/2,2)), gravity = 9.81){
        this.worldx = worldx,
        this.worldy = worldy,
        this.width = width,
        this.height = height,
        this.xSpeed = xSpeed,
        this.ySpeed = ySpeed,
        this.rotSpeed = rotSpeed*Math.PI/2,
        this.colour = colour,
        this.mass = mass,
        this.worldAngle = angle*Math.PI*2,
        this.angle1 = Math.atan((height/2)/(width/2)),
        this.angle2 = Math.atan((width/2)/(height/2)) + (Math.PI/2),
        this.angle3 = Math.atan((height/2)/(width/2)) + Math.PI,
        this.angle4 = Math.atan((-width/2)/(-height/2)) + (Math.PI/2*3),
        this.points = [[0,0],[0,0],[0,0],[0,0]],
        this.pastPoints = this.points,
        this.gravity = gravity,
        this.areachecksize = areachecksize;
        this.friction = friction;
        this.collisionEnergyDecreaseMultiplier = EkCM;
        this.bounciness = bounciness;
        // energy();

    }
    // energy(){
    //     let v = Math.sqrt(Math.pow(this.xSpeed,2) + Math.pow(this.ySpeed,2));
    //     let m = this.mass;
    //     let r = (this.width/2 + this.height/2)/2;
    //     let L = m*v*r;
    //     let w = this.rotSpeed/framesPerSecond;
    //     let I = L/w;
    //     let Ekr = 0.5*I*Math.pow(w,2);
    //     let Ekl = 0.5*m*Math.pow(w,2);
    //     //
    //     let a = cV/cT;
    //     let f = m*a;
    //     let t = f*r;
    //     let ar = t/I;
    //     let w = ar*(1/framesPerSecond);
    // }

    physics(){
        this.oldWorldx = this.worldx;
        this.oldWorldy = this.worldy;
        this.worldAngle += this.rotSpeed/framesPerSecond;
        this.worldx += this.xSpeed/framesPerSecond;
        this.worldy += this.ySpeed/framesPerSecond;
        this.ySpeed += this.gravity/framesPerSecond;
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
        this.collision(this.points, allpoints);
        this.points = allpoints;
    }
    
    draw(){
        drawSquare(X(this.points[0][0]),Y(this.points[0][1]),X(this.points[1][0]),Y(this.points[1][1]),X(this.points[2][0]),Y(this.points[2][1]),X(this.points[3][0]),Y(this.points[3][1]));
    }
    collision(pointsA,pointsB){
        //y = mx+c;
        //m1x1+c1 = m2x2+c2
        //x1 = (m2x2+c2-c1)
        //x = (y-c)/m;
        let rb = this;
        boxColliders.forEach(box => {
            // console.log(box.areachecksize + Math.sqrt(Math.pow(this.width/2,2) + Math.pow(this.height/2,2)),   Math.sqrt(Math.pow(this.worldx - box.worldx,2) + Math.pow(this.worldy - box.worldy,2)),Math.pow(this.worldx - box.worldx,2),Math.pow(this.worldy - box.worldY,2) );
            if(box.areachecksize + Math.sqrt(Math.pow(this.width/2,2) + Math.pow(this.height/2,2)) >= Math.sqrt(Math.pow(this.worldx - box.worldx,2) + Math.pow(this.worldy - box.worldy,2))){
                // console.log("running")
                for(let i =0; i < 4;i++){
                    let yIntersect,gradient;
                    gradient = returnGradient(pointsA[i][0],pointsA[i][1],pointsB[i][0],pointsB[i][1]);
                    yIntersect = returnYIntercept(pointsA[i][0],pointsA[i][1],gradient);
                    for(let ii =0; ii < 4;ii++){//y-mx+c
                        let boxGrad,boxYIntercept,cycle1;
                        if (ii == 3){
                            cycle1 = -3;
                        }else{
                            cycle1 = 1;
                        }
                        boxGrad = returnGradient(box.points[ii][0],box.points[ii][1],box.points[ii+cycle1][0],box.points[ii+cycle1][1]);
                        // [console.log(boxGrad)
                        if (boxGrad !== "vertical" && boxGrad !== "horizontal"){
                            
                            boxYIntercept = returnYIntercept(box.points[ii][0],box.points[ii][1],boxGrad);//dont know where
                            // let ypoint = (boxYIntercept*(-gradient/-boxGrad)-yIntersect)/(((-gradient/-boxGrad) - 1));//did a bad similtaniouseY(c1,c2,m1,m2)
                            let ypoint = similtaniouseY(yIntersect,boxYIntercept,gradient,boxGrad);//did a bad
                            if (ypoint >= smallest([pointsA[i][1],pointsB[i][1]]) && ypoint <= biggest([pointsA[i][1],pointsB[i][1]])){//somewhere
                                // console.log(i,ii,ypoint, smallest([pointsA[i][1],pointsB[i][1]]),biggest([pointsA[i][1],pointsB[i][1]]))
                                
                                let cycle2,cycle3;
                                if (i == 0){
                                    cycle2 = 3;
                                    cycle3 = 1;
                                    
                                }else if (i == 3){
                                    cycle2 = -1;
                                    cycle3 = -3;
                                }else{
                                    cycle2 = -1;
                                    cycle3 = 1;
                                }
                                let pointAfter = pointsA[i+cycle3]; 
                                let pointBefore = pointsA[i+cycle2];
                                let pointNow = pointsA[i];
                                let lengthPointAfter = returnDistanceBetweenIntercepts(pointAfter,-1/boxGrad,boxGrad,boxYIntercept);
                                let lengthPointBefore = returnDistanceBetweenIntercepts(pointBefore,-1/boxGrad,boxGrad,boxYIntercept);
                                // let lengthPointAfter = Math.sqrt(Math.pow(pointAfter[0]-returnX2(similtaniouseY(returnYIntercept(...pointAfter,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad),2)+Math.pow(pointAfter[1]-similtaniouseY(returnYIntercept(...pointAfter,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),2));
                                // let lengthPointBefore = Math.sqrt(Math.pow(pointBefore[0]-returnX2(similtaniouseY(returnYIntercept(...pointBefore,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad),2)+Math.pow(pointBefore[1]-similtaniouseY(returnYIntercept(...pointBefore,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),2));
                                let radiusT = Math.sqrt(Math.pow(returnX2(similtaniouseY(returnYIntercept(rb.worldx,rb.worldy,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad) - returnX2(similtaniouseY(returnYIntercept(...pointNow,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad),2) + Math.pow(similtaniouseY(returnYIntercept(rb.worldx,rb.worldy,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad) - similtaniouseY(returnYIntercept(...pointNow,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),2))
                                console.log(lengthPointAfter,lengthPointBefore,radiusT);
                                if (lengthPointAfter > lengthPointBefore){
                                    radiusT *= -1;
                                }
                                let _L = rb.mass*trigH(rb.ySpeed,rb.xSpeed)*trigH(rb.width/2,rb.height/2);
                                let _I = _L/rb.rotSpeed;
                                
                                let _F = rb.mass;//still need to do
                                
                                let velocitygrad = (rb.ySpeed/rb.xSpeed);
                                let velocitygradtop = returnDistanceBetweenIntercepts(box.points[ii],velocitygrad,-1/boxGrad,boxYIntercept);//here
                                let velocitygradbottom = returnDistanceBetweenIntercepts(box.points[ii],velocitygrad,boxGrad,boxYIntercept);
                                let ratio = velocitygradtop/velocitygradbottom;
                                let velocityPerpendicular = ratio*trigH(rb.ySpeed,rb.xSpeed);
                                






                                // console.log("running");
                                // let oldSpeedGrad = returnGradient(this.oldWorldx,this.oldWorldy,this.worldx,this.worldy);
                                // let speed = Math.sqrt(Math.pow(this.xSpeed,2) + Math.pow(this.ySpeed,2));
                                // let newSpeedGrad = oldSpeedGrad - boxGrad;
                                // let horizontalspeed = speed*(1 /(newSpeedGrad+1));
                                // let verticalspeed = speed*(newSpeedGrad/(newSpeedGrad+1));

                                // let cornergrad = returnGradient(this.oldWorldx,this.oldWorldy,pointsA[i][0],pointsA[i][1]) - oldSpeedGrad;
                                // let rotspeedgrad = 1/cornergrad; // rise / run; rotspeedgrad/1;
                                // let rise = this.rotSpeed*(rotspeedgrad/(rotspeedgrad+1));
                                // console.log(rise,cornergrad,rotspeedgrad);
                                // if(rise < 0){
                                //     console.log("bounce")
                                // }else{
                                //     console.log("nobounce")

                                // }

                                // let v = Math.sqrt(Math.pow(this.xSpeed,2) + Math.pow(this.ySpeed,2));
                                // let m = this.mass;
                                // let r = (this.width/2 + this.height/2)/2;
                                // let L = m*v*r;
                                // let w = this.rotSpeed/framesPerSecond;
                                // let I = L/w;
                                // let Ekr = 0.5*I*Math.pow(w,2);
                                // let Ekl = 0.5*m*Math.pow(w,2);
                                //     //
                                // let a = cV/cT;
                                // let f = m*a;
                                // let t = f*r;
                                // let ar = t/I;
                                // let w = ar*(1/framesPerSecond);
                            
                            }
                        }
                    }
                }
            }
            // if (biggest([pointsB[0][0],pointsB[1][0],pointsB[2][0],pointsB[3][0]]) >= smallest([box.points[0][0],box.points[1][0],box.points[2][0],box.points[3][0]]) && smallest([pointsB[0][0],pointsB[1][0],pointsB[2][0],pointsB[3][0]]) <= biggest([box.points[0][0],box.points[1][0],box.points[2][0],box.points[3][0]]) ){

            // }
            // let rad = Math.sqrt(Math.pow(box.width/2,2) + Math.pow(box.height,2));
            // if(this.nearCheck(box.points,this.points)){//swap the checksize with the obkects

            // }
        });

        //y - mx = c;
        // function circlehitboxdetect(xposC, yposC, radiusC, xpoint, ypoint) {
        //     if (xpoint >= xposC - radiusC && xpoint <= xposC + radiusC && ypoint >= yposC - radiusC && ypoint <= yposC + radiusC) {
        //       let Yintercept1 = Math.sqrt(Math.abs(Math.pow(radiusC, 2) - Math.pow(ypoint - yposC, 2))) + xposC;
        //       let Yintercept2 = (-Math.sqrt(Math.abs(Math.pow(radiusC, 2) - Math.pow(ypoint - yposC, 2)))) + xposC;
        //       if (xpoint >= Yintercept2 && xpoint <= Yintercept1) {
        //         return true;
        //       } else {
        //         return false;
        //       }
        //     } else {
        //       return false;
        //     }
        //   }
        
        //find line intercept between checked lines
    }

}