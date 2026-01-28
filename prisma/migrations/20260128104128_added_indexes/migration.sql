-- CreateIndex
CREATE INDEX "FollowShip_followedId_followedToInt_idx" ON "FollowShip"("followedId", "followedToInt");

-- CreateIndex
CREATE INDEX "FriendShip_user1Id_user2Id_idx" ON "FriendShip"("user1Id", "user2Id");
