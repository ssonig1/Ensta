import user from "../models/user.js";

//read
export const getUser = async (req,res) => {
    try {
        const { id }= req.params
        const User = await user.findById(id);
        res.status(200).json(User);
    }
    catch (err) {
        res.status(404).json({ message : err.message })
    }
}
export const getUserFriends = async (req,res) => {
    try{
        const {id } = req.params;
        const User = await user.findById(id);
        const friends = await Promis.all(
            User.friends.map((id)=>user.findById(id))
        )
        const formattedFriends = friends.map(({_id,firstName,lastName,occupation,location , picturePath})=>{
            return {_id,firstName,lastName,occupation,location , picturePath}
        })
        res.status(200).json(formattedFriends);
    }
    catch (err) {
        res.status(404).json({ message : err.message })
    }
}
//Update
export const addRemoveFriend = async (req, res) => {
    try{
        const {id } = req.params;
        const User = await user.findById(id);
        const friend = await user.findById(friendId)

        if(User.friends.includes(friendId)){
            User.friends = User.friends.filter((id)=>id !== friendId)
            friend.friends = friend.friends.filter((id)=>id !== id)
        }
        else{
            User.friends.push(friendId)
            friend.friends.push(id)
        }
        await User.save()
        await friend.save()
        const friends = await Promis.all(
            User.friends.map((id)=>user.findById(id))
        )
        const formattedFriends = friends.map(({_id,firstName,lastName,occupation,location , picturePath})=>{
            return {_id,firstName,lastName,occupation,location , picturePath}
        })
        res.status(200).json(formattedFriends)
    }
    catch (err) {
        res.status(404).json({ message : err.message })
    }

}