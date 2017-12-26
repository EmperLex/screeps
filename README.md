# EmperLex screeps AI

## Foreword
I dont use scripts from other players beside the tutorial ones because it
may ruin my game experience. Therefore the AI might be terrible, naive
and highly inefficient but thats the way i want to approach my problem solving.

## Logbook
### Phase 1 Being naive ...
Implement naive energy collection just on the shortest energy patch from the first spawn point.
Respawned new creeps until room cap and just used moveTo() pathfinding.

Problems occured:
- Massive amount of probes trying to harvest the same patch
- Deadlock because of probes blocking each others path
- Memory is increasing since Memory.creep is not cleaned up

### Phase 2 Clean up memory & find way for non blocking mining
Clean up memory regulary but not every tick.

Idea to find the number of probes possible to send to a patch from a certain position
without the risk of deadlock (hopefully):

create new temporary cost matrix
find all destinations (spawns, romm controllers)

for every destination (2)
  for each energy patch (3)
    for every mining position arround it (4)

      find a path to it

      if (path found)
        Memory.destination[energy_patch]++
        for every tile of the path
          adapt cost matrix weight of tile to unwalkable
        end for
      else
        break
      endif    

    end for
  end for
end for

This might be pretty resource hungry. We will see...
