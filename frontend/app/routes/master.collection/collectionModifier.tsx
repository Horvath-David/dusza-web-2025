import { Plus } from "lucide-react"
import { useContext, useState } from "react"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select"
import { CardCollectionContext } from "~/context/CardCollectionContext"

const CollectionModifier = () => {

    const {collection, setCollection} = useContext(CardCollectionContext)

    const [cardElement, setCardElement] = useState<string>()
    const [cardName, setCardName] = useState<string>()
    const [cardAttack, setCardAttack] = useState<number>()
    const [cardHealth, setCardHealth] = useState<number>()

    return (
        <main className="p-5">
            <h1 className="text-5xl font-bold text-center">Hozd létre a gyűjteményed!</h1>
            <section className="flex flex-col items-center mt-7">
                <div className="flex flex-col gap-2">

                <h2 className="text-xl">Gyűjteményed</h2>
                <div className="w-[50em] h-[30em] border-2 border-white rounded-2xl">

                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus></Plus>
                            Új hozzáadása
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Új kártya hozzáadása</DialogTitle>
                        </DialogHeader>
                        <div>
                            <form>
                                <FieldGroup>
                                    <FieldSet>
                                        <Field>
                                            <FieldLabel htmlFor="card-name-input">Kártya neve:</FieldLabel>
                                            <Input id="card-name-input"
                                            max={16} 
                                            required
                                            value={cardName}
                                            onChange={(e)=>{setCardName(e.target.value)}}
                                            ></Input>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="card-attack-input">Kártya sebzése:</FieldLabel>
                                            <Input id="card-attack-input"
                                            min={1}
                                            type="number"
                                            value={cardAttack}
                                            onChange={(e)=>{setCardAttack(parseInt(e.target.value))}} 
                                            required
                                            ></Input>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="card-health-input">Kártya életereje:</FieldLabel>
                                            <Input id="card-health-input"
                                            min={1}
                                            type="number"
                                            value={cardHealth}
                                            onChange={(e)=>{setCardHealth(parseInt(e.target.value))}} 
                                            required
                                            ></Input>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Kártya eleme:</FieldLabel>
                                            <Select value={cardElement} onValueChange={(e)=>{setCardElement(e.toString())}} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Válassz egy elemet"></SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Elemek</SelectLabel>
                                                        <SelectItem value="fire">Tűz</SelectItem>
                                                        <SelectItem value="water">Víz</SelectItem>
                                                        <SelectItem value="earth">Föld</SelectItem>
                                                        <SelectItem value="wind">Szél</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field>
                                            <Button type="submit">Létrehozzás</Button>
                                        </Field>
                                    </FieldSet>
                                </FieldGroup>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
                </div>
            </section>
        </main>
    )
}

export default CollectionModifier