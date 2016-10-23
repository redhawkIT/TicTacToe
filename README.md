### Why Immutability Is Important

###

In the previous code example, I suggest using the .slice() operator to copy the squaresarray prior to making changes and to prevent mutating the existing array. Let's talk about what this means and why it an important concept to learn.

There are generally two ways for changing data. The first, and most common method in past, has been to _mutate_ the data by directly changing the values of a variable. The second method is to replace the data with a new copy of the object that also includes desired changes.

##### []()Data change with mutation

###

	varplayer={score:1}
    player.score=2 // same object mutated {score: 2}

##### []()Data change without mutation

###

	varplayer={score:1}
    player={...player,score:2} // new object not mutated {score: 2}

The end result is the same but by not mutating (or changing the underlying data) directly we now have an added benefit that can help us increase component and overall application performance.

##### []()Tracking Changes

###

Determining if a mutated object has changed is complex because changes are made directly to the object. This then requires comparing the current object to a previous copy, traversing the entire object tree, and comparing each variable and value. This process can become increasingly complex.

Determining how a immutable object has changed is considerably easier. If the object being referenced is different from before, then the object has changed. That's it.

#### []()Determining When To Re-render in React

###

The biggest benefit of immutability in React comes when you build simple _pure components_. Since immutable data can more easily determine if changes have been made it also helps to determine when a component requires being re-rendered.

To learn how you can build _pure components_ take a look at [shouldComponentUpdate()](https://facebook.github.io/react/docs/update.html). Also, take a look at the [Immutable.js](https://facebook.github.io/immutable-js/) library to strictly enforce immutable data.

### Functional Components

###

Back to our project, you can now delete the 

constructor from 

Square; we won't need it any more. In fact, React supports a simpler syntax called **stateless functional components** for component types like Square that only consist of a render method. Rather than define a class extending React.Component, simply write a function that takes props and returns what should be rendered:

    function Square(props) {
      return (
        <button className="square" onClick={() => props.onClick()}>
          {props.value}
        </button>
      );
    }

You'll need to change 

this.props to 

props both times it appears. Many components in your apps will be able to written as functional components: these components tend to be easier to write and React will optimize them more in the future.

### Taking Turns

###

An obvious defect in our game is that only X can play. Let's fix that.

Let's default the first move to be by 'X'. Modify our starting state in our 

Game constructor.

    class Board extends React.Component {
      constructor() {
        super();
        this.state = {
          ...
          xIsNext: true,
        };
      }

      ### Each time we move we shall toggle 

xIsNext by flipping the boolean value and saving the state. Now update our handleClick function to flip the value of 
xIsNext.

    handleClick(i) {
      const squares = this.state.squares.slice();
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
      });
    }

   Now X and O take turns. Next, change the "status" text in Board's render so that it also displays who is next.

   ### Declaring a Winner

###

Let's show when the game is won. A calculateWinner(squares) helper function that takes the list of 9 values has been provided for you at the bottom of the file. You can call it in Board's render function to check if anyone has won the game and make the status text show "Winner: [X/O]" when someone wins:

    render() {
      const winner = calculateWinner(this.state.squares);
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      ...
    }

You can now change handleClick to return early and ignore the click if someone has already won the game or if a square is already filled:

    handleClick(i) {
      const squares = this.state.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      ...
    }


    ### Storing a History

   ###

   Let's make it possible to revisit old states of the board so we can see what it looked like after any of the previous moves. We're already creating a new squares array each time a move is made, which means we can easily store the past board states simultaneously.

   Let's plan to store an object like this in state:

       history = [
         {
           squares: [null x 9]
         },
         {
           squares: [... x 9]
         },
         ...
       ]

   We'll want the top-level Game component to be responsible for displaying the list of moves. So just as we pulled the state up before from Square into Board, let's now pull it up again from Board into Game – so that we have all the information we need at the top level.

   First, set up the initial state for 

   Game:

       class Game extends React.Component {
         constructor() {
           super();
           this.state = {
             history: [{
               squares: Array(9).fill(null)
             }],
             xIsNext: true
           };
         }
         ...
       }

   Then remove the constructor and change Board so that it takes squares via props and has its own onClick prop specified by Game, like the transformation we made for Square and Board earlier. You can pass the location of each square into the click handler so that we still know which square was clicked:

       return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;

   Game's render should look at the most recent history entry and can take over calculating the game status:

   const history = this.state.history;
   const current = history[history.length - 1];
   const winner = calculateWinner(current.squares);

       let status;
       if (winner) {
         status = 'Winner: ' + winner;
       } else {
         status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
       }
       ...
       <div className="game-board">
         <Board
           squares={current.squares}
           onClick={() => this.handleClick(i)}
         />
       </div>
       <div className="game-info">
         <div>{status}</div>
         <ol>{/* TODO */}</ol>
       </div>

   Its handleClick can push a new entry onto the stack by concatenating the new history entry to make a new history array:

       handleClick(i) {
         var history = this.state.history;
         var current = history[history.length - 1];
         const squares = current.squares.slice();
         if (calculateWinner(squares) || squares[i]) {
           return;
         }
         squares[i] = this.state.xIsNext ? 'X' : 'O';
         this.setState({
           history: history.concat([{
             squares: squares
           }]),
           xIsNext: !this.state.xIsNext,
         });
       }


     At this point, Board only needs renderStep and render; the state initialization and click handler should both live in Game.

     ### Showing the Moves
     Let's show the previous moves made in the game so far. We learned earlier that React elements are first-class JS objects and we can store them or pass them around. To render multiple items in React, we pass an array of React elements. The most common way to build that array is to map over your array of data. Let's do that in the render method of Game:

         const moves = history.map((step, move) => {
         const desc = move ?
           'Move #' + move :
           'Game start';
         return (
           <li key={move}>
             <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
           </li>
         );
       });
       ...
       <ol>{moves}</ol>



   ### Implementing Time Travel

   ###

   For our move list, we already have a unique ID for each step: the number of the move when it happened. Add the key as <li key {move}> and the key warning should disappear.

   Clicking any of the move links throws an error because jumpTo is undefined. Let's add a new key to Game's state to indicate which step we're currently viewing. First, add stepNumber: 0 to the initial state, then have jumpTo update that state.

   We also want to update xIsNext. We set xIsNext to true if the index of the move number is an even number.


       jumpTo(step) {
         this.setState({
           stepNumber: step,
           xIsNext: (step % 2) ? false : true,
         });
       }

   Then update stepNumber when a new move is made by adding stepNumber: history.length to the state update in handleClick. Now you can modify render to read from that step in the history:

       const current = history[this.state.stepNumber];

    If you click any move link now, the board should immediately update to show what the game looked like at that time. You may also want to update handleClick to be aware of stepNumber when reading the current board state so that you can go back in time then click in the board to create a new entry. (Hint: It's easiest to .slice() off the extra elements from history at the very top of handleClick.)
