const draggableTiles = [
    {
        id: 'tile_me',
        angle: -2.5,
    },
    {
        id: 'tile_personality',
        angle: 2,
    },
    {
        id: 'tile_football',
        angle: -1,
    },
    {
        id: 'tile_projects',
        angle: 1,
    },
    {
        id: 'tile_reactjs',
        angle: 4,
    },
    {
        id: 'tile_contact',
        angle: 5,
    }    
];

let dragInfo = {
    active: false,
    activeTileIndex: undefined,
    tiles: []
};

initHandlers = () => {
    const desktop = document.getElementById('desktop');
    desktop.addEventListener("touchstart", startMoveTile, false);
    desktop.addEventListener("touchend", stopMoveTile, false);
    desktop.addEventListener("touchmove", moveTile, false);
    desktop.addEventListener("mousedown", startMoveTile, false);
    desktop.addEventListener("mouseup", stopMoveTile, false);
    desktop.addEventListener("mousemove", moveTile, false);
}

initDraggables = () => {
    dragInfo.tiles = draggableTiles.map((tile, index) => {
        const element = document.getElementById(tile.id);
        const angle = tile.angle;
        setElementTransform(element, 0, 0, angle);
        return {
            element: element,
            id: tile.id,
            positionOffset: [0, 0],
            currentPosition: [0, 0],
            angle: angle,
            zIndex: draggableTiles.length - index
        }
    });
}

getClientPosition = (event) => {
    clientPosition = [0, 0];
    if (event.type === "touchstart" || event.type === "touchmove") {
        clientPosition = [event.touches[0].clientX, event.touches[0].clientY];
    } else {
        clientPosition = [event.clientX, event.clientY];
    }
    return clientPosition;
}

startMoveTile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const activeTileIndex = dragInfo.tiles.findIndex(tile => tile.element === event.target);
    if (activeTileIndex !== dragInfo.activeTileIndex && activeTileIndex !== -1) {
        dragInfo.active = true;
        dragInfo.activeTileIndex = activeTileIndex;        
        const clientPosition = getClientPosition(event);
        dragInfo.tiles[dragInfo.activeTileIndex].positionOffset = [
            clientPosition[0] - dragInfo.tiles[dragInfo.activeTileIndex].currentPosition[0],
            clientPosition[1] - dragInfo.tiles[dragInfo.activeTileIndex].currentPosition[1]
        ];
        
        // calculate new z-order
        const prevZIndex = dragInfo.tiles[activeTileIndex].zIndex;
        for (let i = prevZIndex + 1; i < draggableTiles.length + 1; i++) {
            const tile = dragInfo.tiles.find(tile => tile.zIndex === i);
            tile.zIndex--;
        }
        dragInfo.tiles[activeTileIndex].zIndex = draggableTiles.length;

        // re-set to element
        dragInfo.tiles.forEach(tile => {
            tile.element.style.zIndex = tile.zIndex;
        });
    }
}

stopMoveTile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (dragInfo.active === true) {
        dragInfo.active = false;
        dragInfo.tiles[dragInfo.activeTileIndex].positionOffset = dragInfo.tiles[dragInfo.activeTileIndex].currentPosition;
        dragInfo.activeTileIndex = undefined;
    }
}

moveTile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (dragInfo.active === true) {
        const clientPosition = getClientPosition(event);
        dragInfo.tiles[dragInfo.activeTileIndex].currentPosition = [
            clientPosition[0] - dragInfo.tiles[dragInfo.activeTileIndex].positionOffset[0],
            clientPosition[1] - dragInfo.tiles[dragInfo.activeTileIndex].positionOffset[1]
        ];
        setElementTransform(
            dragInfo.tiles[dragInfo.activeTileIndex].element,
            dragInfo.tiles[dragInfo.activeTileIndex].currentPosition[0],
            dragInfo.tiles[dragInfo.activeTileIndex].currentPosition[1],
            dragInfo.tiles[dragInfo.activeTileIndex].angle
        );
    }
}

setElementTransform = (element, x, y, angle) => {
    element.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) rotate(' + angle + 'deg)';
}


/*function draw()
  {
var canvas = document.getElementById('circle');
if (canvas.getContext)
{
var ctx = canvas.getContext('2d'); 
var X = canvas.width / 4;
var Y = canvas.height / 2;
var R = 80;
ctx.beginPath();
ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
ctx.lineWidth = 3;
ctx.strokeStyle = '#FF0000';
ctx.stroke();
}
}*/