export function appReducer(state,action)
{
    const newState={
        user:{...state.user},
        offersList:(Array.isArray(state.offersList))?state.offersList.map(element=>({...element})):state.offersList,
        currentOffer:{...state.currentOffer},
        submitStatus:state.submitStatus,
        editStatus:state.editStatus,
    };

    switch(action.type)
    {
        case "setUser":
            {
                newState.user=action.payload;
                
            }
        break;
        case "setList":
            {
                newState.offersList=action.payload;
                
            }
        break;

        case "editStatus":
            {
               newState.editStatus=action.payload;
            }
        break;

        case "setCurrentOffer":
            {
                newState.currentOffer=action.payload;
            }
        break;

        case "submitStatus":
            {
                newState.submitStatus=action.payload;
            }
        break;

        
    }

    return newState;

}


