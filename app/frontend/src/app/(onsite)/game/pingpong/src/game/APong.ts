import { PongState } from "@/app/(onsite)/game/types/PongTypes"

class APong {
    CANVAS_WIDTH = 1600
    CANVAS_HEIGHT = 900
    PADDLE_WIDTH = 15
    PADDLE_HEIGHT = 100
    HALF_PADDLE = 50
    BALL_RADIUS = 10


    protected render = (ctx: CanvasRenderingContext2D, state: PongState) => {
        ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT) // clears the canvas
        ctx.fillStyle = 'white' // fill color
        ctx.strokeStyle = 'white' // stroke color
        
        ctx.font = '120px "AtariPongScore"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${state.players[0].score}`, this.CANVAS_WIDTH * 0.35, 120)
        ctx.fillText(`${state.players[1].score}`, this.CANVAS_WIDTH * 0.65, 120)
    
        // player 1 paddle
        ctx.fillRect(
            state.players[0].pos.x - 5,
            state.players[0].pos.y - this.HALF_PADDLE,
            this.PADDLE_WIDTH,
            this.PADDLE_HEIGHT
        )
    
        // player 2 paddle
        ctx.fillRect(
            state.players[1].pos.x - 5, // pos x
            state.players[1].pos.y - this.HALF_PADDLE, // pos y
            this.PADDLE_WIDTH,
            this.PADDLE_HEIGHT
        )
    
        // dashed line
        ctx.setLineDash([18, 25]) // dash - gap
        ctx.lineWidth = 2
        ctx.beginPath() // resets the pen position
        ctx.moveTo(this.CANVAS_WIDTH / 2, 0) // moves the pen to a new position without drawing
        ctx.lineTo(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT) // draws line from prev pos to new pos and updates pos
        ctx.stroke() // sets the outline color to the previously set stroke color
        ctx.setLineDash([]) // resets the lineDash so that new drawn stuff doesn't draw line dash
    
        ctx.font = '24px "Serious2b"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    
        ctx.beginPath();
        ctx.arc(
            state.ball.x,           // x position (center of the ball)
            state.ball.y,           // y position (center of the ball)
            this.BALL_RADIUS,       // radius (assuming width = height)
            0,                          // start angle
            2 * Math.PI                 // end angle (full circle)
        );
    
        ctx.fill();
    }
}

export default APong;