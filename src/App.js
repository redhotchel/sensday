import './App.css';
import {useState} from "react";

const App = () => {
    const [result, setResult] = useState("");
    const [Mode, setMode] = useState(false); // Стейт на смену режима
    const onKonstuktor = () => {
        setMode((current) => !current)
    }
    const onRunTime = () => {
        setMode((current) => !current)
    }

    const handleClick = (e) => { //функция на нажатие цифр и их склеивание
        (Mode === false) && setResult(result.concat(e.target.name));
    }
    const calculate = () => { //функция вычисления при нажатии "="
        try {
            (Mode === false) &&  setResult(eval(result).toString());
        } catch (err) {
            (Mode === false) &&   setResult('Error')
        }

    }

    const [boards, setBoards] = useState([ //стейт с цифрами и второй доской
        {
            id: 1,
            items: [
                {
                    buttons: [{button: '/'}, {button: '*'}, {button: '-'}, {button: '+'}],
                    style: 'calculation'
                },
                {
                    buttons: [{button: '7'}, {button: '8'}, {button: '9'},
                        {button: '4'}, {button: '5'}, {button: '6'},
                        {button: '1'}, {button: '2'}, {button: '3'}],
                    style: 'keypad'
                },
                {
                    buttons: [{button: '0'}, {button: '.'}],
                    style: 'zerodot'
                },
                {
                    buttons: [{button: '='}],
                    style: 'result'
                }
            ]

        },
        {
            id: 2,
            items: []
        }]);

    const [currentBoard, setCurrentBoard] = useState(null)  //стейт на выбранную доску
    const [currentItem, setCurrentItem] = useState(null)    //стейт на выбранный элемент(цифры, либо вычисление)

    function dragOverHandler(e) {
        (Mode === true) && e.preventDefault()
        if ((Mode === true) && e.target.className === 'item' ) {
            e.target.style.boxShadow = '0 4px 3px green'
        }
    }

    function dragLeaveHandler(e) {
        e.target.style.boxShadow = 'none'
    }

    function dragStartHandler(e, board, item) {
        (Mode === true) && setCurrentBoard(board)
        setCurrentItem(item)
    }

    function dragEndHandler(e) {
        e.target.style.boxShadow = 'none'
    }

    function dropHandler(e, board, item) {                                  //функция переноса
        e.preventDefault()
        const currentIndex = currentBoard.items.indexOf(currentItem)
        currentBoard.items.splice(currentIndex, 1)
        const dropIndex = board.items.indexOf(item)
        board.items.splice(dropIndex + 1, 0, currentItem)
        setBoards(boards.map(b => {
            if (b.id === board.id) {
                return board
            }
            if (b.id === currentBoard.id) {
                return currentBoard
            }
            return b
        }))
        e.target.style.boxShadow = 'none'
        e.stopPropagation()

    }

    function dropCardHandler(e, board) {                                    //функция на возможность переноса на пустую доску
        board.items.push(currentItem)
        const currentIndex = currentBoard.items.indexOf(currentItem)
        currentBoard.items.splice(currentIndex, 1)
        setBoards(boards.map(b => {
            if (b.id === board.id) {
                return board
            }
            if (b.id === currentBoard.id) {
                return currentBoard
            }
            return b
        }))
        e.target.style.boxShadow = 'none'
        e.stopPropagation()
    }

    return (
        <div className='app'>
            <button onClick={onKonstuktor}>
                Konstruktor
            </button >
            <button onClick={onRunTime}>
                Runtime
            </button>
            {boards.map(board =>
                <div className='board'
                     onDragOver={(e) => dragOverHandler(e)}
                     onDrop={(e) => dropCardHandler(e, board)}
                >
                    <div className='board__title'>
                        <form className="input">
                            <input type="text" value={result}/>
                        </form>
                    </div>
                    {board.items.map(item =>
                        <div onDragOver={(e) => dragOverHandler(e)} //событие на взятия
                             onDragLeave={(e) => dragLeaveHandler(e)}
                             onDragStart={(e) => dragStartHandler(e, board, item)}
                             onDragEnd={(e) => dragEndHandler(e)}
                             onDrop={(e) => dropHandler(e, board, item)}
                             draggable={true}
                             className='item'>
                            <span className={item.style}>
                            {item.buttons.map(button =>
                                <button name={button.button}
                                        onClick={(button.button === "=") ? calculate : handleClick}>{button.button}</button> //Проверяем нажатие на цифры или на вычисление
                            )}</span>


                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
