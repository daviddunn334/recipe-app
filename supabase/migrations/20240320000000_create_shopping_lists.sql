-- Drop existing tables if they exist
DROP TABLE IF EXISTS shopping_list_items;
DROP TABLE IF EXISTS shopping_lists;

-- Create shopping_lists table
CREATE TABLE public.shopping_lists (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, NOW()),
    CONSTRAINT shopping_lists_pkey PRIMARY KEY (id),
    CONSTRAINT shopping_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
) TABLESPACE pg_default;

-- Create shopping_list_items table
CREATE TABLE public.shopping_list_items (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    shopping_list_id UUID NOT NULL,
    ingredient_id UUID NOT NULL,
    quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, NOW()),
    CONSTRAINT shopping_list_items_pkey PRIMARY KEY (id),
    CONSTRAINT shopping_list_items_shopping_list_id_ingredient_id_key UNIQUE (shopping_list_id, ingredient_id),
    CONSTRAINT shopping_list_items_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    CONSTRAINT shopping_list_items_shopping_list_id_fkey FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create triggers for updated_at
CREATE TRIGGER update_shopping_lists_updated_at
    BEFORE UPDATE ON shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_list_items_updated_at
    BEFORE UPDATE ON shopping_list_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Users can create their own shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Users can update their own shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Users can delete their own shopping lists" ON shopping_lists;
DROP POLICY IF EXISTS "Users can view items in their lists" ON shopping_list_items;
DROP POLICY IF EXISTS "Users can add items to their lists" ON shopping_list_items;
DROP POLICY IF EXISTS "Users can update items in their lists" ON shopping_list_items;
DROP POLICY IF EXISTS "Users can delete items from their lists" ON shopping_list_items;

-- Shopping lists policies
CREATE POLICY "Users can view their own shopping lists"
    ON shopping_lists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shopping lists"
    ON shopping_lists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists"
    ON shopping_lists FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists"
    ON shopping_lists FOR DELETE
    USING (auth.uid() = user_id);

-- Shopping list items policies
CREATE POLICY "Users can view items in their lists"
    ON shopping_list_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM shopping_lists
            WHERE shopping_lists.id = shopping_list_items.shopping_list_id
            AND shopping_lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add items to their lists"
    ON shopping_list_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM shopping_lists
            WHERE shopping_lists.id = shopping_list_items.shopping_list_id
            AND shopping_lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update items in their lists"
    ON shopping_list_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM shopping_lists
            WHERE shopping_lists.id = shopping_list_items.shopping_list_id
            AND shopping_lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete items from their lists"
    ON shopping_list_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM shopping_lists
            WHERE shopping_lists.id = shopping_list_items.shopping_list_id
            AND shopping_lists.user_id = auth.uid()
        )
    );

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS shopping_lists_user_id_idx;
DROP INDEX IF EXISTS shopping_list_items_shopping_list_id_idx;
DROP INDEX IF EXISTS shopping_list_items_ingredient_id_idx;

-- Create indexes
CREATE INDEX shopping_lists_user_id_idx ON shopping_lists(user_id);
CREATE INDEX shopping_list_items_shopping_list_id_idx ON shopping_list_items(shopping_list_id);
CREATE INDEX shopping_list_items_ingredient_id_idx ON shopping_list_items(ingredient_id); 