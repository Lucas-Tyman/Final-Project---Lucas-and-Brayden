/* global Phaser */

// Copyright (c) 2022 Brayden Blank all rights reserved


// Created on: April-May 2022
// This is the Game Scene

class GameScene extends Phaser.Scene {
  // create an alien
  createAlien () {
    const alienXLocation = Math.floor(Math.random() * 1920) + 1 
    let alienXVelocity = Math.floor(Math.random() *5) + 1
    alienXVelocity *= Math.round(Math.random()) ? 1 : -1
    const anAlien = this.physics.add.sprite(alienXLocation, -100, "alien")
    anAlien.body.velocity.y = 200
    anAlien.body.velocity.x = alienXVelocity
    this.alienGroup.add(anAlien)
  }
  
  constructor () {
    super({key: "gameScene" })

    this.background = null
    this.ship = null
    this.fireMissile = false
    this.score = 0
    this.scoreText = null
    this.scoreTextStyle = { font: "65px Arial", fill: "#ffffff", align: "center" }
    this.gameOverTextStyle = { font: "65px Arial", fill: "#ff0000", align: "center"}
  }

  init (data) {
    this.cameras.main.setBackgroundColor("#ffffff")
  }
  
  preload () {
    console.log("Game Scene")

    // images
    this.load.image("deathStarBackground", "assets/deathStarBackground.png")
    this.load.image("millenniumFalcon", "assets/millenniumFalcon.png")
    this.load.image("asteroid", "assets/asteroid.png")
    //sound
    this.load.audio("backgroundMusic", "assets/backgroundMusic.mp3")
  }

  create (data) {
    this.background = this.add.image(0, 0, "deathStarBackground").setScale(2.0)
    this.background.setOrigin(0, 0)

    this.scoreText = this.add.text(10, 10, "Score: " + this.score.toString(), this.scoreTextStyle)

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, "ship")

    // create a group for the missiles
    this.missileGroup = this.physics.add.group()

    // create a group for the aliens
    this.alienGroup = this.add.group()
    this.createAlien()

    // Collisions between missiles and aliens
    this.physics.add.collider(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
      alienCollide.destroy()
      missileCollide.destroy()
      this.sound.play("explosion")
      this.score = this.score + 1
      this.scoreText.setText("Score: " + this.score.toString())
      this.createAlien()
      this.createAlien() 
    }.bind(this))

    // Collisions between ship and aliens
    this.physics.add.collider(this.ship, this.alienGroup, function (shipCollide, alienCollide) {
      this.sound.play("bomb")
      this.physics.pause()
      alienCollide.destroy()
      shipCollide.destroy()
      this.gameOverText = this.add.text(1920 / 2, 1080 / 2, "Game Over!\nClick to play again.", this.gameOverTextStyle).setOrigin(0.5)
      this.gameOverText.setInteractive({ useHandCursor: true })
      this.score = 0
      this.gameOverText.on("pointerdown", () => this.scene.start("gameScene"))
    }.bind(this))
    
  }

  update (time, delta) {
    // called 60 times a second, hopefully!

    const keyLeftObj = this.input.keyboard.addKey("LEFT")
    const keyRightObj = this.input.keyboard.addKey("RIGHT")
    const keyUpObj = this.input.keyboard.addKey("UP")
    const keyDownObj = this.input.keyboard.addKey("DOWN")
    const keySpaceObj = this.input.keyboard.addKey("SPACE")
    
    if (keyLeftObj.isDown === true) {
      this.ship.x -= 15
      if (this.ship.x <0){
        this.ship.x = 0
      }
    }

    if (keyRightObj.isDown === true) {
      this.ship.x += 15
      if (this.ship.x > 1920) {
        this.ship.x = 1920 
      }
    } 
    
    if (keyUpObj.isDown === true) {
      this.ship.y -= 6
      if (this.ship.y < 700) {
        this.ship.y = 700
      }
    }

    if (keyDownObj.isDown === true) {
      this.ship.y += 6
      if (this.ship.y > 1080) {
        this.ship.y = 1080
      }
    }    
    
    if (keySpaceObj.isDown === true) {
      if (this.fireMissile === false) {
        // fire missile
        this.fireMissile = true 
        const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, "missile")
        this.missileGroup.add(aNewMissile)
        this.sound.play("laser")
      }
    }

    if (keySpaceObj.isUp === true) {
      this.fireMissile = false
    }

    this.missileGroup.children.each(function (item) {
      item.y = item.y - 15
      if (item.y < 0) {
        item.destroy()
      }
    })
  }
}

export default GameScene